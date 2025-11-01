import bcrypt from 'bcryptjs';
import dynamoDB, { QueryCommand } from '../../utils/dynamodb.js';
import { generateToken, createResponse } from '../../utils/auth.js';

const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    if (!email) {
      return createResponse(400, { error: 'Email is required' });
    }

    if (!password) {
      return createResponse(400, { error: 'Password is required' });
    }

    // Find user by email
    const result = await dynamoDB.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return createResponse(401, { error: 'Invalid email or password' });
    }
    const user = result.Items[0];

    // Verify password
    if (!user.passwordHash) {
      return createResponse(401, { error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return createResponse(401, { error: 'Invalid email or password' });
    }

    const token = generateToken(user.userId, user.email);

    return createResponse(200, {
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        nativeLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
