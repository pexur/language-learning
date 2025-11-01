import dynamoDB, { GetCommand } from '../../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../../utils/auth.js';

const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
  try {
    const authUser = getUserFromEvent(event);

    if (!authUser) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    // Fetch user details
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId: authUser.userId },
      })
    );
    const user = result.Item;

    if (!user) {
      return createResponse(404, { error: 'User not found' });
    }

    return createResponse(200, {
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        nativeLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
