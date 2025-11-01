import { v4 as uuidv4 } from 'uuid';
import dynamoDB, { PutCommand, GetCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';
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

    // Auto-translate the word(s) if no translation provided
    const words = [];
    
    if (!translation) {
      try {
        const translationResults = await translateWord(text, nativeLanguage, targetLanguage);
        
        // Create a word for each translation result
        for (const result of translationResults) {
          const word = {
            userId: user.userId,
            wordId: uuidv4(),
            text: result.originalWord || text, // Use originalWord from result, fallback to input text
            translation: result.translation,
            wordType: result.wordType || null,
            gender: result.gender || null,
            definitions: result.definitions || null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          
          await dynamoDB.send(
            new PutCommand({
              TableName: WORDS_TABLE,
              Item: word,
            })
          );
          
          words.push(word);
        }
      } catch (error) {
        console.error('Auto-translation failed:', error);
        // Continue without translation if auto-translation fails
        const word = {
          userId: user.userId,
          wordId: uuidv4(),
          text,
          translation: null,
          wordType: null,
          gender: null,
          definitions: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        await dynamoDB.send(
          new PutCommand({
            TableName: WORDS_TABLE,
            Item: word,
          })
        );
        
        words.push(word);
      }
    } else {
      // Translation provided, create single word
      const word = {
        userId: user.userId,
        wordId: uuidv4(),
        text,
        translation: translation,
        wordType: null,
        gender: null,
        definitions: definitions || null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await dynamoDB.send(
        new PutCommand({
          TableName: WORDS_TABLE,
          Item: word,
        })
      );
      
      words.push(word);
    }

    // Always return words as an array for consistency
    return createResponse(201, { words });
  } catch (error) {
    console.error('Create word error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
