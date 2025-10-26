import { v4 as uuidv4 } from 'uuid';
import dynamoDB, { QueryCommand, PutCommand } from '../../utils/dynamodb.js';
import { generateToken, createResponse } from '../../utils/auth.js';

const USERS_TABLE = process.env.USERS_TABLE;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

export const handler = async (event) => {
  try {
    const { code, targetLanguage } = event.queryStringParameters || {};

    if (!code) {
      return createResponse(400, { error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${FRONTEND_URL}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return createResponse(400, { error: 'Failed to get access token' });
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userInfoResponse.json();

    if (!googleUser.email) {
      return createResponse(400, { error: 'Failed to get user info' });
    }

    // Check if user exists
    const existingUser = await dynamoDB.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': googleUser.email,
        },
      })
    );

    let user;

    if (existingUser.Items && existingUser.Items.length > 0) {
      // User exists, return existing user
      user = existingUser.Items[0];
    } else {
      // Create new user
      const userId = uuidv4();
      user = {
        userId,
        email: googleUser.email,
        name: googleUser.name || googleUser.email.split('@')[0],
        targetLanguage: targetLanguage || 'Spanish', // Default or from query param
        provider: 'google',
        providerId: googleUser.id,
        avatar: googleUser.picture,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await dynamoDB.send(
        new PutCommand({
          TableName: USERS_TABLE,
          Item: user,
        })
      );
    }

    const token = generateToken(user.userId, user.email);

    // Redirect to frontend with token
    return {
      statusCode: 302,
      headers: {
        Location: `${FRONTEND_URL}/auth/callback?token=${token}`,
      },
    };
  } catch (error) {
    console.error('Google OAuth error:', error);
    return {
      statusCode: 302,
      headers: {
        Location: `${FRONTEND_URL}/auth/error?message=${encodeURIComponent('Authentication failed')}`,
      },
    };
  }
};
