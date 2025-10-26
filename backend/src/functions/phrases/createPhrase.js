import { v4 as uuidv4 } from 'uuid';
import dynamoDB, { PutCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';
import { localDB, isLocalMode } from '../../utils/localdb.js';

const PHRASES_TABLE = process.env.PHRASES_TABLE;

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

    const phrase = {
      userId: user.userId,
      phraseId: uuidv4(),
      text,
      translation: translation || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (isLocalMode()) {
      await localDB.putPhrase(phrase);
    } else {
      await dynamoDB.send(
        new PutCommand({
          TableName: PHRASES_TABLE,
          Item: phrase,
        })
      );
    }

    return createResponse(201, { phrase });
  } catch (error) {
    console.error('Create phrase error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
