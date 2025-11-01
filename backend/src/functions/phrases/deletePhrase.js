import dynamoDB, { DeleteCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';

const PHRASES_TABLE = process.env.PHRASES_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    const { id } = event.pathParameters;

    if (!id) {
      return createResponse(400, { error: 'Phrase ID is required' });
    }

    await dynamoDB.send(
      new DeleteCommand({
        TableName: PHRASES_TABLE,
        Key: {
          userId: user.userId,
          phraseId: id,
        },
      })
    );

    return createResponse(200, { message: 'Phrase deleted successfully' });
  } catch (error) {
    console.error('Delete phrase error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
