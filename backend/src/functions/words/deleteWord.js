import dynamoDB, { DeleteCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';

const WORDS_TABLE = process.env.WORDS_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    const { id } = event.pathParameters;

    if (!id) {
      return createResponse(400, { error: 'Word ID is required' });
    }

    await dynamoDB.send(
      new DeleteCommand({
        TableName: WORDS_TABLE,
        Key: {
          userId: user.userId,
          wordId: id,
        },
      })
    );

    return createResponse(200, { message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Delete word error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
