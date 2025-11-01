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
          // translation field = corrected spelling of the word in target language
          // definitions[].meaning = native language translation
          const word = {
            userId: user.userId,
            wordId: uuidv4(),
            translation: result.translation, // Target language word (corrected spelling)
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
        // Store the input as translation (target language word) even if translation failed
        const word = {
          userId: user.userId,
          wordId: uuidv4(),
          translation: text, // Use input text as the target language word
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
      // translation = target language word (corrected spelling)
      // definitions = native language meanings
      const word = {
        userId: user.userId,
        wordId: uuidv4(),
        translation: translation, // Target language word
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
