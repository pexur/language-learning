import express from 'express';
import { translateWord, translatePhrase } from '../utils/gemini.js';
import { userQueries } from '../utils/db.js';

const router = express.Router();

// Translate word or phrase
router.post('/', async (req, res) => {
  try {
    const { text, type } = req.body;

    if (!text || !type) {
      return res.status(400).json({ error: 'Text and type are required' });
    }

    // Get user's target language
    const user = await userQueries.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const targetLanguage = user.target_language;
    let result;

    if (type === 'word') {
      result = await translateWord(text, targetLanguage);
    } else if (type === 'phrase') {
      result = await translatePhrase(text, targetLanguage);
    } else {
      return res.status(400).json({ error: 'Invalid type. Must be "word" or "phrase"' });
    }

    res.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: 'Translation failed',
      message: error.message,
    });
  }
});

export default router;
