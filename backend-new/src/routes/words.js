import express from 'express';
import { wordQueries } from '../utils/db.js';

const router = express.Router();

// Get all words for current user
router.get('/', async (req, res) => {
  try {
    const words = await wordQueries.findByUser(req.user.userId);

    // Format response to match frontend expectations
    const formattedWords = words.map(word => ({
      wordId: word.word_id,
      userId: word.user_id,
      text: word.text,
      translation: word.translation,
      definitions: word.definitions,
      createdAt: new Date(word.created_at).getTime(),
      updatedAt: new Date(word.updated_at).getTime(),
    }));

    res.json({ words: formattedWords });
  } catch (error) {
    console.error('Get words error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new word
router.post('/', async (req, res) => {
  try {
    const { text, translation, definitions } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const word = await wordQueries.create({
      userId: req.user.userId,
      text,
      translation: translation || null,
      definitions: definitions || null,
    });

    res.status(201).json({
      word: {
        wordId: word.word_id,
        userId: word.user_id,
        text: word.text,
        translation: word.translation,
        definitions: word.definitions,
        createdAt: new Date(word.created_at).getTime(),
        updatedAt: new Date(word.updated_at).getTime(),
      },
    });
  } catch (error) {
    console.error('Create word error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete word
router.delete('/:id', async (req, res) => {
  try {
    const wordId = req.params.id;
    const deletedWord = await wordQueries.delete(req.user.userId, wordId);

    if (!deletedWord) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Delete word error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
