import dynamoDB, { QueryCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';

const PHRASES_TABLE = process.env.PHRASES_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    const result = await dynamoDB.send(
      new QueryCommand({
        TableName: PHRASES_TABLE,
        IndexName: 'UserCreatedAtIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': user.userId,
        },
        ScanIndexForward: false, // Most recent first
      })
    );
    const phrases = result.Items || [];

    return createResponse(200, { phrases });
  } catch (error) {
    console.error('Get phrases error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
