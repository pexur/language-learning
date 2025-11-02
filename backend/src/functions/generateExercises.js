import dynamoDB, { QueryCommand, GetCommand, PutCommand } from '../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';
import { generateExerciseSet } from '../utils/gemini.js';

const WORDS_TABLE = process.env.WORDS_TABLE;
const PHRASES_TABLE = process.env.PHRASES_TABLE;
const USERS_TABLE = process.env.USERS_TABLE;
const EXERCISES_TABLE = process.env.EXERCISES_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    // Get user's language preferences
    const userResult = await dynamoDB.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId: user.userId },
      })
    );
    const userData = userResult.Item;

    if (!userData) {
      return createResponse(404, { error: 'User not found' });
    }

    const { nativeLanguage, targetLanguage } = userData;

    // Fetch all words and phrases for the user
    const [wordsResult, phrasesResult] = await Promise.all([
      dynamoDB.send(
        new QueryCommand({
          TableName: WORDS_TABLE,
          IndexName: 'UserCreatedAtIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': user.userId,
          },
          ScanIndexForward: false,
        })
      ),
      dynamoDB.send(
        new QueryCommand({
          TableName: PHRASES_TABLE,
          IndexName: 'UserCreatedAtIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': user.userId,
          },
          ScanIndexForward: false,
        })
      ),
    ]);
    
    const words = wordsResult.Items || [];
    const phrases = phrasesResult.Items || [];

    // Filter words and phrases that have translations
    const validWords = words.filter(w => w.translation);
    const validPhrases = phrases.filter(p => p.translation);

    if (validWords.length === 0 && validPhrases.length === 0) {
      return createResponse(400, { 
        error: 'No translated words or phrases available. Please add and translate some words/phrases first.' 
      });
    }

    // Create a cache key based on user's vocabulary and language preferences
    // Include date (YYYY-MM-DD) to create unique exercises per day
    const vocabularyHash = createVocabularyHash(validWords, validPhrases);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const cacheKey = `${user.userId}#${nativeLanguage}#${targetLanguage}#${today}#${vocabularyHash}`;

    // First, try to get exercises from database cache for today
    let exercises;
    let exerciseItem;
    try {
      exerciseItem = await getCachedExerciseItem(cacheKey);
      if (exerciseItem && exerciseItem.exerciseData) {
        exercises = exerciseItem.exerciseData;
        console.log(`Found cached exercises for user: ${user.userId} for date: ${today}`);
        return createResponse(200, { 
          exercises,
          date: today,
          exerciseId: cacheKey
        });
      }
    } catch (error) {
      console.warn('Failed to get cached exercises:', error);
    }

    // If not in cache, generate simple exercises by randomly selecting words
    console.log(`Generating new exercises for user: ${user.userId} for date: ${today}`);
    
    // Generate word exercises (parts 1 and 2) using random selection
    const wordExercises = generateSimpleExercises(validWords, validPhrases, nativeLanguage, targetLanguage);
    
    // Generate sentence exercises (part 3) using Gemini with all user words
    let sentenceExercises = [];
    if (validWords.length > 0) {
      try {
        sentenceExercises = await generateExerciseSet(validWords, nativeLanguage, targetLanguage);
        // Add direction field to sentence exercises
        sentenceExercises = sentenceExercises.map(exercise => ({
          ...exercise,
          direction: 'sentence',
        }));
      } catch (error) {
        console.error('Failed to generate sentence exercises:', error);
        // Continue without sentences if generation fails
        sentenceExercises = [];
      }
    }
    
    exercises = {
      words: wordExercises.words,
      wordsReverse: wordExercises.wordsReverse,
      sentences: sentenceExercises,
    };

    // Cache the result for future requests with empty userResponses
    try {
      await cacheExercises(cacheKey, exercises, user.userId, today);
      console.log(`Cached exercises for user: ${user.userId} for date: ${today}`);
    } catch (error) {
      console.warn('Failed to cache exercises:', error);
      // Don't fail the request if caching fails
    }

    return createResponse(200, { 
      exercises,
      date: today,
      exerciseId: cacheKey
    });
  } catch (error) {
    console.error('Generate exercises error:', error);
    return createResponse(500, { 
      error: 'Failed to generate exercises',
      message: error.message 
    });
  }
};

/**
 * Create a hash of the user's vocabulary for cache key generation
 * @param {Array} words - Array of words
 * @param {Array} phrases - Array of phrases
 * @returns {string} - Hash string representing the vocabulary
 */
function createVocabularyHash(words, phrases) {
  // Use translation (target language word) and first definition meaning (native language) for hash
  const wordKeys = words
    .filter(w => w.translation)
    .map(w => {
      const nativeMeaning = w.definitions && w.definitions.length > 0 ? w.definitions[0].meaning : '';
      return `${w.translation}:${nativeMeaning}`;
    })
    .sort();
  const phraseKeys = phrases.map(p => `${p.text}:${p.translation}`).sort();
  const combined = [...wordKeys, ...phraseKeys].join('|');
  
  // Simple hash function (in production, you might want to use crypto.createHash)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get cached exercise item from database (including userResponses)
 * @param {string} cacheKey - The cache key to look up
 * @returns {Promise<Object|null>} - Cached exercise item or null if not found
 */
async function getCachedExerciseItem(cacheKey) {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: EXERCISES_TABLE,
      Key: { 
        userId: cacheKey.split('#')[0], // Extract userId from cache key
        exerciseId: cacheKey 
      },
    })
  );

  return result.Item || null;
}

/**
 * Cache exercises in database
 * @param {string} cacheKey - The cache key
 * @param {Object} exerciseData - The exercise data to store
 * @param {string} userId - The user ID
 * @param {string} date - The date (YYYY-MM-DD)
 */
async function cacheExercises(cacheKey, exerciseData, userId, date) {
  const item = {
    userId: cacheKey.split('#')[0], // Extract userId from cache key
    exerciseId: cacheKey,
    exerciseData,
    userResponses: {}, // Initialize empty responses object
    date: date, // Store date for easy querying
    createdAt: Date.now(),
  };

  console.log('Caching exercise item:', JSON.stringify(item, null, 2));
  console.log('EXERCISES_TABLE:', EXERCISES_TABLE);

  await dynamoDB.send(
    new PutCommand({
      TableName: EXERCISES_TABLE,
      Item: item,
    })
  );
  console.log('Cached exercises in DynamoDB');
}

/**
 * Generate simple translation exercises from randomly selected words
 * @param {Array} words - Array of words with translations
 * @param {Array} phrases - Array of phrases with translations (not used for first two parts)
 * @param {string} nativeLanguage - Native language
 * @param {string} targetLanguage - Target language
 * @returns {Object} - Exercise set with words and wordsReverse
 */
function generateSimpleExercises(words, phrases, nativeLanguage, targetLanguage) {
  // Filter words that have both translation (target language word) and definitions (native language meanings)
  const validWords = words.filter(w => w.translation && w.definitions && w.definitions.length > 0);
  
  if (validWords.length === 0) {
    return {
      words: [],
      wordsReverse: [],
      sentences: [],
    };
  }
  
  // Shuffle words to randomize selection
  const shuffled = [...validWords].sort(() => Math.random() - 0.5);
  
  // Select 10 words for native to target (can reuse words if needed)
  const wordsForNativeToTarget = shuffled.slice(0, Math.min(10, shuffled.length));
  // Select 10 words for target to native (can reuse or get different words)
  const wordsForTargetToNative = shuffled.slice(0, Math.min(10, shuffled.length));
  
  // First 10: Native -> Target (user sees native language meaning, fills target language word)
  // translation = target language word (corrected spelling)
  // definitions[0].meaning = native language translation
  const nativeToTarget = wordsForNativeToTarget.map((word, index) => {
    const nativeMeaning = word.definitions[0]?.meaning || '';
    return {
      id: `nt-${index + 1}`,
      type: 'word_to_target',
      question: nativeMeaning, // Native language meaning from definitions
      correctAnswer: word.translation, // Target language word
      sources: [{
        id: word.wordId,
        type: 'word'
      }],
      direction: 'native_to_target',
    };
  });
  
  // Second 10: Target -> Native (user sees target language word, fills native language meaning)
  const targetToNative = wordsForTargetToNative.map((word, index) => {
    const nativeMeaning = word.definitions[0]?.meaning || '';
    return {
      id: `tn-${index + 1}`,
      type: 'word_to_native',
      question: word.translation, // Target language word
      correctAnswer: nativeMeaning, // Native language meaning from definitions
      sources: [{
        id: word.wordId,
        type: 'word'
      }],
      direction: 'target_to_native',
    };
  });
  
  return {
    words: nativeToTarget,
    wordsReverse: targetToNative,
    sentences: [], // Empty for now
  };
}

