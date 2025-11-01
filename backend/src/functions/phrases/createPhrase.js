import { v4 as uuidv4 } from 'uuid';
import dynamoDB, { PutCommand, GetCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';
import { translatePhrase } from '../../utils/gemini.js';

const PHRASES_TABLE = process.env.PHRASES_TABLE;
const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    const body = JSON.parse(event.body);
    const { text, translation } = body;

    if (!text) {
      return createResponse(400, { error: 'Text is required' });
    }

    // Get user's language preferences for auto-translation
    let nativeLanguage = 'English';
    let targetLanguage = 'Spanish';
    try {
      const userResult = await dynamoDB.send(
        new GetCommand({
          TableName: USERS_TABLE,
          Key: { userId: user.userId },
        })
      );
      nativeLanguage = userResult.Item?.nativeLanguage || 'English';
      targetLanguage = userResult.Item?.targetLanguage || 'Spanish';
    } catch (error) {
      console.warn('Could not get user language preferences, using defaults:', error);
    }

    // Auto-translate the phrase if no translation provided
    let finalTranslation = translation;
    if (!translation) {
      try {
        const translationResult = await translatePhrase(text, nativeLanguage, targetLanguage);
        finalTranslation = translationResult.translation;
      } catch (error) {
        console.error('Auto-translation failed:', error);
        // Continue without translation if auto-translation fails
        finalTranslation = null;
      }
    }

    const phrase = {
      userId: user.userId,
      phraseId: uuidv4(),
      text,
      translation: finalTranslation,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: PHRASES_TABLE,
        Item: phrase,
      })
    );

    return createResponse(201, { phrase });
  } catch (error) {
    console.error('Create phrase error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
