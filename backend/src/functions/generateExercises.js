import dynamoDB, { QueryCommand, GetCommand } from '../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';
import { localDB, isLocalMode } from '../utils/localdb.js';
import { generateExerciseSet } from '../utils/gemini.js';

const WORDS_TABLE = process.env.WORDS_TABLE;
const PHRASES_TABLE = process.env.PHRASES_TABLE;
const USERS_TABLE = process.env.USERS_TABLE;

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

    // Generate exercises using Gemini
    const exercises = await generateExerciseSet(
      validWords,
      validPhrases,
      nativeLanguage,
      targetLanguage
    );

    return createResponse(200, { exercises });
  } catch (error) {
    console.error('Generate exercises error:', error);
    return createResponse(500, { 
      error: 'Failed to generate exercises',
      message: error.message 
    });
  }
};

