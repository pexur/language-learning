import { translateWord, translatePhrase } from '../utils/gemini.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';
import dynamoDB, { GetCommand } from '../utils/dynamodb.js';

const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
  try {
    // Authenticate user
    const authUser = getUserFromEvent(event);
    if (!authUser) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    // Get user's target language
    const userResult = await dynamoDB.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId: authUser.userId },
      })
    );

    if (!userResult.Item) {
      return createResponse(404, { error: 'User not found' });
    }

    const { targetLanguage, nativeLanguage } = userResult.Item;

    const body = JSON.parse(event.body);
    const { text, type } = body;

    if (!text || !type) {
      return createResponse(400, { error: 'Text and type are required' });
    }

    let result;

    if (type === 'word') {
      result = await translateWord(text, nativeLanguage, targetLanguage);
    } else if (type === 'phrase') {
      result = await translatePhrase(text, nativeLanguage, targetLanguage);
    } else {
      return createResponse(400, { error: 'Invalid type. Must be "word" or "phrase"' });
    }

    return createResponse(200, result);
  } catch (error) {
    console.error('Translation error:', error);
    return createResponse(500, {
      error: 'Translation failed',
      message: error.message,
    });
  }
};
