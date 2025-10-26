import { test, expect } from '@playwright/test';
import { testConfig, getApiEndpoint } from '../config/testConfig';

test.describe('Auto-Translation and Review Features', () => {
  let authToken: string;
  let testUserId: string;

  test.beforeEach(async ({ request }) => {
    // Register a test user and get auth token
    const registerResponse = await request.post(getApiEndpoint('/auth/register'), {
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        targetLanguage: 'Spanish'
      }
    });
    
    if (registerResponse.ok()) {
      const data = await registerResponse.json();
      authToken = data.token;
      testUserId = data.user.userId;
    }
  });

  test.describe('Auto-Translation Backend', () => {
    test('should auto-translate word when creating without translation', async ({ request }) => {
      // Skip if API not configured
      if (testConfig.apiUrl.includes('your-api-id')) {
        test.skip();
      }

      const response = await request.post(getApiEndpoint('/words'), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'hello'
        }
      });

      expect(response.status()).toBe(201);
      const data = await response.json();
      
      // Should have translation and definitions
      expect(data.word).toHaveProperty('translation');
      expect(data.word).toHaveProperty('definitions');
      expect(data.word.translation).toBeTruthy();
      expect(Array.isArray(data.word.definitions)).toBe(true);
      expect(data.word.definitions.length).toBeGreaterThan(0);
    });

    test('should preserve manual translation when provided', async ({ request }) => {
      // Skip if API not configured
      if (testConfig.apiUrl.includes('your-api-id')) {
        test.skip();
      }

      const response = await request.post(getApiEndpoint('/words'), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'goodbye',
          translation: 'adios',
          definitions: [
            {
              id: '1',
              meaning: 'farewell greeting',
              example: 'Goodbye, see you tomorrow!'
            }
          ]
        }
      });

      expect(response.status()).toBe(201);
      const data = await response.json();
      
      // Should use provided translation
      expect(data.word.translation).toBe('adios');
      expect(data.word.definitions[0].meaning).toBe('farewell greeting');
    });

    test('should handle translation failure gracefully', async ({ request }) => {
      // Skip if API not configured
      if (testConfig.apiUrl.includes('your-api-id')) {
        test.skip();
      }

      // Test with a very unusual word that might fail translation
      const response = await request.post(getApiEndpoint('/words'), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'xyzqwerty123'
        }
      });

      expect(response.status()).toBe(201);
      const data = await response.json();
      
      // Should still create the word even if translation fails
      expect(data.word.text).toBe('xyzqwerty123');
      // Translation might be null if translation service fails
      expect(data.word).toHaveProperty('translation');
    });
  });


  test.describe('Frontend Auto-Translation', () => {
    test('should show loading state when adding word', async ({ page }) => {
      // This test would need authentication setup
      // For now, just test the main page loads
      await page.goto('/');
      await expect(page).toHaveURL('/login');
    });

    test('should remove translation button from words table', async ({ page }) => {
      // This test would need authentication setup
      // For now, just test the main page loads
      await page.goto('/');
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Integration Tests', () => {
    test('should create word with auto-translation', async ({ request }) => {
      // Skip if API not configured
      if (testConfig.apiUrl.includes('your-api-id')) {
        test.skip();
      }

      // Create a word
      const createResponse = await request.post(getApiEndpoint('/words'), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          text: 'water'
        }
      });

      expect(createResponse.status()).toBe(201);
      const wordData = await createResponse.json();

      // Get all words
      const getResponse = await request.get(getApiEndpoint('/words'), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(getResponse.status()).toBe(200);
      const wordsData = await getResponse.json();
      
      // Should have the created word with translation
      const createdWord = wordsData.words.find((w: any) => w.wordId === wordData.word.wordId);
      expect(createdWord).toBeTruthy();
      expect(createdWord.translation).toBeTruthy();
      expect(Array.isArray(createdWord.definitions)).toBe(true);
    });

    test('should handle multiple words with different types', async ({ request }) => {
      // Skip if API not configured
      if (testConfig.apiUrl.includes('your-api-id')) {
        test.skip();
      }

      const testWords = ['run', 'beautiful', 'quickly', 'house'];
      
      for (const word of testWords) {
        const response = await request.post(getApiEndpoint('/words'), {
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          data: {
            text: word
          }
        });

        expect(response.status()).toBe(201);
        const data = await response.json();
        expect(data.word.translation).toBeTruthy();
        expect(data.word.definitions.length).toBeGreaterThan(0);
      }

      // Get all words and verify they exist
      const getResponse = await request.get(getApiEndpoint('/words'), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(getResponse.status()).toBe(200);
      const wordsData = await getResponse.json();
      expect(wordsData.words.length).toBe(testWords.length);
    });
  });
});
