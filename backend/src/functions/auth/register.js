import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import dynamoDB, { PutCommand, QueryCommand } from '../../utils/dynamodb.js';
import { generateToken, createResponse } from '../../utils/auth.js';

const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  try {
    const body = JSON.parse(event.body);
    const { email, name, nativeLanguage, targetLanguage, password, provider = 'email', providerId } = body;

    if (!email || !targetLanguage || !nativeLanguage) {
      return createResponse(400, { error: 'Email, native language, and target language are required' });
    }

    // Password is required only for email signup (provider === 'email')
    if (provider === 'email' && (!password || password.length < 6)) {
      return createResponse(400, { error: 'Password is required and must be at least 6 characters long' });
    }

    if (nativeLanguage === targetLanguage) {
      return createResponse(400, { error: 'Native and target languages must be different' });
    }

    // Check if user already exists
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

    // Hash password if provided (for email signup)
    let passwordHash = null;
    if (password && provider === 'email') {
      passwordHash = await bcrypt.hash(password, 10);
    }

    // Create new user
    const userId = uuidv4();
    const user = {
      userId,
      email,
      name: name || email.split('@')[0],
      nativeLanguage,
      targetLanguage,
      ...(passwordHash && { passwordHash }),
      provider,
      providerId: providerId || email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    );

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
