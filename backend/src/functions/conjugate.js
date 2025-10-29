import { conjugateFrenchVerb } from '../utils/gemini.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';
import dynamoDB, { GetCommand, PutCommand } from '../utils/dynamodb.js';
import { localDB, isLocalMode } from '../utils/localdb.js';

const USERS_TABLE = process.env.USERS_TABLE;
const CONJUGATIONS_TABLE = process.env.CONJUGATIONS_TABLE;

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

    // Normalize verb to lowercase for consistent storage
    const normalizedVerb = verb.toLowerCase().trim();

    // First, try to get conjugations from database cache
    let conjugations;
    try {
      conjugations = await getCachedConjugation(normalizedVerb);
      if (conjugations) {
        console.log(`Found cached conjugation for: ${normalizedVerb}`);
        return createResponse(200, conjugations);
      }
    } catch (error) {
      console.warn('Failed to get cached conjugation:', error);
    }

    // If not in cache, generate new conjugation using AI
    console.log(`Generating new conjugation for: ${normalizedVerb}`);
    conjugations = await conjugateFrenchVerb(normalizedVerb);

    // Cache the result for future requests
    try {
      await cacheConjugation(normalizedVerb, conjugations);
      console.log(`Cached conjugation for: ${normalizedVerb}`);
    } catch (error) {
      console.warn('Failed to cache conjugation:', error);
      // Don't fail the request if caching fails
    }

    return createResponse(200, conjugations);
  } catch (error) {
    console.error('Conjugation error:', error);
    return createResponse(500, {
      error: 'Conjugation failed',
      message: error.message,
    });
  }
};

/**
 * Get cached conjugation from database
 * @param {string} verb - The verb to look up
 * @returns {Promise<Object|null>} - Cached conjugation data or null if not found
 */
async function getCachedConjugation(verb) {
  if (isLocalMode()) {
    return await localDB.getConjugation(verb);
  }

  const result = await dynamoDB.send(
    new GetCommand({
      TableName: CONJUGATIONS_TABLE,
      Key: { verb },
    })
  );

  return result.Item ? result.Item.conjugationData : null;
}

/**
 * Cache conjugation in database
 * @param {string} verb - The verb to cache
 * @param {Object} conjugationData - The conjugation data to store
 */
async function cacheConjugation(verb, conjugationData) {
  const item = {
    verb,
    conjugationData,
    createdAt: Date.now(),
  };

  if (isLocalMode()) {
    await localDB.saveConjugation(item);
    return;
  }

  await dynamoDB.send(
    new PutCommand({
      TableName: CONJUGATIONS_TABLE,
      Item: item,
    })
  );
}

