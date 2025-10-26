import { v4 as uuidv4 } from 'uuid';
import dynamoDB, { PutCommand, QueryCommand } from '../../utils/dynamodb.js';
import { generateToken, createResponse } from '../../utils/auth.js';
import { localDB, isLocalMode } from '../../utils/localdb.js';

const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  try {
    const body = JSON.parse(event.body);
    const { email, name, nativeLanguage, targetLanguage, provider = 'email', providerId } = body;

    if (!email || !targetLanguage || !nativeLanguage) {
      return createResponse(400, { error: 'Email, native language, and target language are required' });
    }

    if (nativeLanguage === targetLanguage) {
      return createResponse(400, { error: 'Native and target languages must be different' });
    }

    // Check if user already exists
    let existingUser;
    if (isLocalMode()) {
      existingUser = await localDB.getUserByEmail(email);
      if (existingUser) {
        return createResponse(400, { error: 'User already exists' });
      }
    } else {
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
      if (result.Items && result.Items.length > 0) {
        return createResponse(400, { error: 'User already exists' });
      }
    }

    // Create new user
    const userId = uuidv4();
    const user = {
      userId,
      email,
      name: name || email.split('@')[0],
      nativeLanguage,
      targetLanguage,
      provider,
      providerId: providerId || email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (isLocalMode()) {
      await localDB.putUser(user);
    } else {
      await dynamoDB.send(
        new PutCommand({
          TableName: USERS_TABLE,
          Item: user,
        })
      );
    }

    const token = generateToken(userId, email);

    return createResponse(201, {
      message: 'User registered successfully',
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
    console.error('Registration error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
