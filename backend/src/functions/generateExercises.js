import dynamoDB, { QueryCommand, GetCommand, PutCommand } from '../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';
import { localDB, isLocalMode } from '../utils/localdb.js';
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
    let userData;
    if (isLocalMode()) {
      userData = await localDB.getUser(user.userId);
    } else {
      const userResult = await dynamoDB.send(
        new GetCommand({
          TableName: USERS_TABLE,
          Key: { userId: user.userId },
        })
      );
      userData = userResult.Item;
    }

    if (!userData) {
      return createResponse(404, { error: 'User not found' });
    }

    const { nativeLanguage, targetLanguage } = userData;

    // Fetch all words and phrases for the user
    let words, phrases;
    
    if (isLocalMode()) {
      words = await localDB.getWords(user.userId);
      phrases = await localDB.getPhrases(user.userId);
    } else {
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
      
      words = wordsResult.Items || [];
      phrases = phrasesResult.Items || [];
    }

    // Filter words and phrases that have translations
    const validWords = words.filter(w => w.translation);
    const validPhrases = phrases.filter(p => p.translation);

    if (validWords.length === 0 && validPhrases.length === 0) {
      return createResponse(400, { 
        error: 'No translated words or phrases available. Please add and translate some words/phrases first.' 
      });
    }

    // Create a cache key based on user's vocabulary and language preferences
    const vocabularyHash = createVocabularyHash(validWords, validPhrases);
    const cacheKey = `${user.userId}#${nativeLanguage}#${targetLanguage}#${vocabularyHash}`;

    // First, try to get exercises from database cache
    let exercises;
    try {
      exercises = await getCachedExercises(cacheKey);
      if (exercises) {
        console.log(`Found cached exercises for user: ${user.userId}`);
        return createResponse(200, { exercises });
      }
    } catch (error) {
      console.warn('Failed to get cached exercises:', error);
    }

    // If not in cache, generate new exercises using AI
    console.log(`Generating new exercises for user: ${user.userId}`);
    exercises = await generateExerciseSet(
      validWords,
      validPhrases,
      nativeLanguage,
      targetLanguage
    );

    // Cache the result for future requests
    try {
      await cacheExercises(cacheKey, exercises, user.userId);
      console.log(`Cached exercises for user: ${user.userId}`);
    } catch (error) {
      console.warn('Failed to cache exercises:', error);
      // Don't fail the request if caching fails
    }

    return createResponse(200, { exercises });
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
  const wordKeys = words.map(w => `${w.text}:${w.translation}`).sort();
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
 * Get cached exercises from database
 * @param {string} cacheKey - The cache key to look up
 * @returns {Promise<Object|null>} - Cached exercise data or null if not found
 */
async function getCachedExercises(cacheKey) {
  if (isLocalMode()) {
    return await localDB.getExercises(cacheKey);
  }

  const result = await dynamoDB.send(
    new GetCommand({
      TableName: EXERCISES_TABLE,
      Key: { 
        userId: cacheKey.split('#')[0], // Extract userId from cache key
        exerciseId: cacheKey 
      },
    })
  );

  return result.Item ? result.Item.exerciseData : null;
}

/**
 * Cache exercises in database
 * @param {string} cacheKey - The cache key
 * @param {Object} exerciseData - The exercise data to store
 * @param {string} userId - The user ID
 */
async function cacheExercises(cacheKey, exerciseData, userId) {
  const item = {
    userId: cacheKey.split('#')[0], // Extract userId from cache key
    exerciseId: cacheKey,
    exerciseData,
    createdAt: Date.now(),
  };

  if (isLocalMode()) {
    await localDB.saveExercises(item);
    return;
  }

  await dynamoDB.send(
    new PutCommand({
      TableName: EXERCISES_TABLE,
      Item: item,
    })
  );
}

