import { v4 as uuidv4 } from 'uuid';
import dynamoDB, { PutCommand, GetCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';
import { localDB, isLocalMode } from '../../utils/localdb.js';
import { translateWord } from '../../utils/gemini.js';

const WORDS_TABLE = process.env.WORDS_TABLE;
const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    const body = JSON.parse(event.body);
    const { text, translation, definitions } = body;

    if (!text) {
      return createResponse(400, { error: 'Text is required' });
    }

    // Get user's language preferences for auto-translation
    let nativeLanguage = 'English';
    let targetLanguage = 'Spanish';
    try {
      if (isLocalMode()) {
        const userData = await localDB.getUser(user.userId);
        nativeLanguage = userData?.nativeLanguage || 'English';
        targetLanguage = userData?.targetLanguage || 'Spanish';
      } else {
        const userResult = await dynamoDB.send(
          new GetCommand({
            TableName: USERS_TABLE,
            Key: { userId: user.userId },
          })
        );
        nativeLanguage = userResult.Item?.nativeLanguage || 'English';
        targetLanguage = userResult.Item?.targetLanguage || 'Spanish';
      }
    } catch (error) {
      console.warn('Could not get user language preferences, using defaults:', error);
    }

    // Auto-translate the word if no translation provided
    let finalTranslation = translation;
    let finalDefinitions = definitions;
    
    if (!translation) {
      try {
        const translationResult = await translateWord(text, nativeLanguage, targetLanguage);
        finalTranslation = translationResult.translation;
        finalDefinitions = translationResult.definitions;
      } catch (error) {
        console.error('Auto-translation failed:', error);
        // Continue without translation if auto-translation fails
        finalTranslation = null;
        finalDefinitions = null;
      }
    }

    const word = {
      userId: user.userId,
      wordId: uuidv4(),
      text,
      translation: finalTranslation,
      definitions: finalDefinitions,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (isLocalMode()) {
      await localDB.putWord(word);
    } else {
      await dynamoDB.send(
        new PutCommand({
          TableName: WORDS_TABLE,
          Item: word,
        })
      );
    }

    return createResponse(201, { word });
  } catch (error) {
    console.error('Create word error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
