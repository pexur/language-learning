import { test, expect } from '@playwright/test';

test.describe('Language Learning API Tests', () => {
  const API_BASE_URL = 'http://localhost:3000/api';

  test.describe('Authentication API', () => {
    test('should register a new user', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/auth/register`, {
        data: {
          email: 'test@example.com',
          name: 'Test User',
          targetLanguage: 'es'
        }
      });

      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe('test@example.com');
    });

    test('should login with valid credentials', async ({ request }) => {
      // First register a user
      await request.post(`${API_BASE_URL}/auth/register`, {
        data: {
          email: 'test@example.com',
          name: 'Test User',
          targetLanguage: 'es'
        }
      });

      // Then login
      const response = await request.post(`${API_BASE_URL}/auth/login`, {
        data: {
          email: 'test@example.com'
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('user');
    });

    test('should fail login with invalid credentials', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/auth/login`, {
        data: {
          email: 'nonexistent@example.com'
        }
      });

      expect(response.status()).toBe(401);
    });
  });

  test.describe('Words API', () => {
    let authToken: string;

    test.beforeEach(async ({ request }) => {
      // Register and get auth token
      const response = await request.post(`${API_BASE_URL}/auth/register`, {
        data: {
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
          targetLanguage: 'es'
        }
      });
      const data = await response.json();
      authToken = data.token;
    });

    test('should create a new word', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/words`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'hello',
          language: 'en'
        }
      });

      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('word');
      expect(data.word.text).toBe('hello');
    });

    test('should get user words', async ({ request }) => {
      // Create a word first
      await request.post(`${API_BASE_URL}/words`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'hello',
          language: 'en'
        }
      });

      // Get words
      const response = await request.get(`${API_BASE_URL}/words`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('words');
      expect(Array.isArray(data.words)).toBe(true);
      expect(data.words.length).toBeGreaterThan(0);
    });

    test('should delete a word', async ({ request }) => {
      // Create a word first
      const createResponse = await request.post(`${API_BASE_URL}/words`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'hello',
          language: 'en'
        }
      });
      const { word } = await createResponse.json();

      // Delete the word
      const response = await request.delete(`${API_BASE_URL}/words/${word.wordId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status()).toBe(200);
    });
  });

  test.describe('Phrases API', () => {
    let authToken: string;

    test.beforeEach(async ({ request }) => {
      // Register and get auth token
      const response = await request.post(`${API_BASE_URL}/auth/register`, {
        data: {
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
          targetLanguage: 'es'
        }
      });
      const data = await response.json();
      authToken = data.token;
    });

    test('should create a new phrase', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/phrases`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'How are you?',
          language: 'en'
        }
      });

      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('phrase');
      expect(data.phrase.text).toBe('How are you?');
    });

    test('should get user phrases', async ({ request }) => {
      // Create a phrase first
      await request.post(`${API_BASE_URL}/phrases`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'How are you?',
          language: 'en'
        }
      });

      // Get phrases
      const response = await request.get(`${API_BASE_URL}/phrases`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('phrases');
      expect(Array.isArray(data.phrases)).toBe(true);
      expect(data.phrases.length).toBeGreaterThan(0);
    });
  });

  test.describe('Translation API', () => {
    let authToken: string;

    test.beforeEach(async ({ request }) => {
      // Register and get auth token
      const response = await request.post(`${API_BASE_URL}/auth/register`, {
        data: {
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
          targetLanguage: 'es'
        }
      });
      const data = await response.json();
      authToken = data.token;
    });

    test('should translate a word', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/translate`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'hello',
          type: 'word'
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('translation');
      expect(data).toHaveProperty('definitions');
      expect(typeof data.translation).toBe('string');
      expect(Array.isArray(data.definitions)).toBe(true);
    });

    test('should translate a phrase', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/translate`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'How are you?',
          type: 'phrase'
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('translation');
      expect(typeof data.translation).toBe('string');
    });
  });
});
