import { v4 as uuidv4 } from 'uuid';
import dynamoDB, { QueryCommand, PutCommand } from '../../utils/dynamodb.js';
import { generateToken, createResponse } from '../../utils/auth.js';

const USERS_TABLE = process.env.USERS_TABLE;
const WECHAT_APP_ID = process.env.WECHAT_APP_ID;
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

export const handler = async (event) => {
  try {
    const { code, targetLanguage } = event.queryStringParameters || {};

    if (!code) {
      return createResponse(400, { error: 'Authorization code is required' });
    }

    // Exchange code for access token (WeChat API)
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}&code=${code}&grant_type=authorization_code`;

    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token || !tokenData.openid) {
      console.error('WeChat token error:', tokenData);
      return createResponse(400, { error: 'Failed to get access token from WeChat' });
    }

    // Get user info from WeChat
    const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}&lang=en`;

    const userInfoResponse = await fetch(userInfoUrl);
    const wechatUser = await userInfoResponse.json();

    if (wechatUser.errcode) {
      console.error('WeChat user info error:', wechatUser);
      return createResponse(400, { error: 'Failed to get user info from WeChat' });
    }

    // WeChat doesn't always provide email, use openid as unique identifier
    const userIdentifier = wechatUser.openid;

    // Check if user exists by providerId (openid)
    const existingUser = await dynamoDB.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': `wechat_${userIdentifier}`, // Use prefixed openid as email substitute
        },
      })
    );

    let user;

    if (existingUser.Items && existingUser.Items.length > 0) {
      user = existingUser.Items[0];
    } else {
      // Create new user
      const userId = uuidv4();
      user = {
        userId,
        email: `wechat_${userIdentifier}`, // Pseudo email
        name: wechatUser.nickname || 'WeChat User',
        targetLanguage: targetLanguage || 'Chinese', // Default for WeChat users
        provider: 'wechat',
        providerId: userIdentifier,
        avatar: wechatUser.headimgurl,
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
    console.error('WeChat OAuth error:', error);
    return {
      statusCode: 302,
      headers: {
        Location: `${FRONTEND_URL}/auth/error?message=${encodeURIComponent('WeChat authentication failed')}`,
      },
    };
  }
};
