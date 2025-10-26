import { conjugateFrenchVerb } from '../utils/gemini.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';
import dynamoDB, { GetCommand } from '../utils/dynamodb.js';
import { localDB, isLocalMode } from '../utils/localdb.js';

const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
  try {
    // Authenticate user
    const authUser = getUserFromEvent(event);
    if (!authUser) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    // Get user's target language
    let userData;
    if (isLocalMode()) {
      userData = await localDB.getUser(authUser.userId);
    } else {
      const userResult = await dynamoDB.send(
        new GetCommand({
          TableName: USERS_TABLE,
          Key: { userId: authUser.userId },
        })
      );
      userData = userResult.Item;
    }

    if (!userData) {
      return createResponse(404, { error: 'User not found' });
    }

    const { targetLanguage } = userData;

    // Only support French conjugations for now
    if (targetLanguage !== 'French') {
      return createResponse(400, { error: 'Conjugation is only supported for French verbs' });
    }

    const body = JSON.parse(event.body);
    const { verb } = body;

    if (!verb) {
      return createResponse(400, { error: 'Verb is required' });
    }

    const conjugations = await conjugateFrenchVerb(verb);

    return createResponse(200, conjugations);
  } catch (error) {
    console.error('Conjugation error:', error);
    return createResponse(500, {
      error: 'Conjugation failed',
      message: error.message,
    });
  }
};

