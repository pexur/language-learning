import express from 'express';
import { userQueries } from '../utils/db.js';
import { generateToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, name, targetLanguage, provider = 'email', providerId } = req.body;

    if (!email || !targetLanguage) {
      return res.status(400).json({ error: 'Email and target language are required' });
    }

    // Check if user already exists
    const existingUser = await userQueries.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = await userQueries.create({
      email,
      name: name || email.split('@')[0],
      targetLanguage,
      provider,
      providerId: providerId || email,
    });

    const token = generateToken(user.user_id, user.email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        name: user.name,
        targetLanguage: user.target_language,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await userQueries.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = generateToken(user.user_id, user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        name: user.name,
        targetLanguage: user.target_language,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await userQueries.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user.user_id,
      email: user.email,
      name: user.name,
      targetLanguage: user.target_language,
      provider: user.provider,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OAuth callback handlers (Google)
router.get('/google/callback', async (req, res) => {
  try {
    // TODO: Implement Google OAuth flow
    // For now, return error
    res.status(501).json({ error: 'Google OAuth not yet implemented in new backend' });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OAuth callback handlers (WeChat)
router.get('/wechat/callback', async (req, res) => {
  try {
    // TODO: Implement WeChat OAuth flow
    // For now, return error
    res.status(501).json({ error: 'WeChat OAuth not yet implemented in new backend' });
  } catch (error) {
    console.error('WeChat OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
