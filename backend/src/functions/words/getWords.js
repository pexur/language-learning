import dynamoDB, { QueryCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';

const WORDS_TABLE = process.env.WORDS_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    const result = await dynamoDB.send(
      new QueryCommand({
        TableName: WORDS_TABLE,
        IndexName: 'UserCreatedAtIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': user.userId,
        },
        ScanIndexForward: false, // Most recent first
      })
    );
    const words = result.Items || [];

    return createResponse(200, { words });
  } catch (error) {
    console.error('Get words error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
