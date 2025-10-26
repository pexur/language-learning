// Simple in-memory database for local development
// Simulates DynamoDB without needing AWS credentials

const db = {
  users: new Map(),
  words: new Map(),
  phrases: new Map(),
};

const isLocal = process.env.IS_OFFLINE === 'true';

export const localDB = {
  // Users
  async putUser(user) {
    if (!isLocal) throw new Error('Use DynamoDB in production');
    db.users.set(user.userId, user);
    return user;
  },

  async getUserByEmail(email) {
    if (!isLocal) throw new Error('Use DynamoDB in production');
    const users = Array.from(db.users.values());
    return users.find(u => u.email === email);
  },

  async getUser(userId) {
    if (!isLocal) throw new Error('Use DynamoDB in production');
    return db.users.get(userId);
  },

  // Words
  async putWord(word) {
    if (!isLocal) throw new Error('Use DynamoDB in production');
    const key = `${word.userId}#${word.wordId}`;
    db.words.set(key, word);
    return word;
  },

  async getWords(userId) {
    if (!isLocal) throw new Error('Use DynamoDB in production');
    const words = Array.from(db.words.values())
      .filter(w => w.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
    return words;
  },

  async deleteWord(userId, wordId) {
    if (!isLocal) throw new Error('Use DynamoDB in production');
    const key = `${userId}#${wordId}`;
    db.words.delete(key);
  },

  // Phrases
  async putPhrase(phrase) {
    if (!isLocal) throw new Error('Use DynamoDB in production');
    const key = `${phrase.userId}#${phrase.phraseId}`;
    db.phrases.set(key, phrase);
    return phrase;
  },

  async getPhrases(userId) {
    if (!isLocal) throw new Error('Use DynamoDB in production');
    const phrases = Array.from(db.phrases.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
    return phrases;
  },

  async deletePhrase(userId, phraseId) {
    if (!isLocal) throw new Error('Use DynamoDB in production');
    const key = `${userId}#${phraseId}`;
    db.phrases.delete(key);
  },
};

export const isLocalMode = () => isLocal;
