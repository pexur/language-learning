import { v4 as uuidv4 } from 'uuid';
import dynamoDB, { PutCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';
import { localDB, isLocalMode } from '../../utils/localdb.js';

const WORDS_TABLE = process.env.WORDS_TABLE;

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

    const word = {
      userId: user.userId,
      wordId: uuidv4(),
      text,
      translation: translation || null,
      definitions: definitions || null,
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
