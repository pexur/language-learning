import express from 'express';
import { phraseQueries } from '../utils/db.js';

const router = express.Router();

// Get all phrases for current user
router.get('/', async (req, res) => {
  try {
    const phrases = await phraseQueries.findByUser(req.user.userId);

    // Format response to match frontend expectations
    const formattedPhrases = phrases.map(phrase => ({
      phraseId: phrase.phrase_id,
      userId: phrase.user_id,
      text: phrase.text,
      translation: phrase.translation,
      createdAt: new Date(phrase.created_at).getTime(),
      updatedAt: new Date(phrase.updated_at).getTime(),
    }));

    res.json({ phrases: formattedPhrases });
  } catch (error) {
    console.error('Get phrases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new phrase
router.post('/', async (req, res) => {
  try {
    const { text, translation } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const phrase = await phraseQueries.create({
      userId: req.user.userId,
      text,
      translation: translation || null,
    });

    res.status(201).json({
      phrase: {
        phraseId: phrase.phrase_id,
        userId: phrase.user_id,
        text: phrase.text,
        translation: phrase.translation,
        createdAt: new Date(phrase.created_at).getTime(),
        updatedAt: new Date(phrase.updated_at).getTime(),
      },
    });
  } catch (error) {
    console.error('Create phrase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete phrase
router.delete('/:id', async (req, res) => {
  try {
    const phraseId = req.params.id;
    const deletedPhrase = await phraseQueries.delete(req.user.userId, phraseId);

    if (!deletedPhrase) {
      return res.status(404).json({ error: 'Phrase not found' });
    }

    res.json({ message: 'Phrase deleted successfully' });
  } catch (error) {
    console.error('Delete phrase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
