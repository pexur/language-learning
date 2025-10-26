import { Page, expect } from '@playwright/test';

/**
 * Test utilities for language learning app
 * These utilities help background agents write consistent tests
 */

export class TestUtils {
  constructor(private page: Page) {}

  /**
   * Navigate to a specific page and wait for it to load
   */
  async navigateToPage(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login with test credentials
   */
  async login(email: string = 'test@example.com', password: string = 'testpassword123') {
    await this.navigateToPage('/login');
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
    await this.page.waitForURL('/');
  }

  /**
   * Register a new user
   */
  async register(email: string, password: string, confirmPassword: string) {
    await this.navigateToPage('/register');
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.fill('[data-testid="confirm-password"]', confirmPassword);
    await this.page.click('[data-testid="register-button"]');
  }

  /**
   * Add a new word to the vocabulary
   */
  async addWord(word: string, translation: string, language: string = 'en') {
    await this.page.click('[data-testid="add-word-button"]');
    await this.page.fill('[data-testid="word-input"]', word);
    await this.page.fill('[data-testid="translation-input"]', translation);
    await this.page.selectOption('[data-testid="language-select"]', language);
    await this.page.click('[data-testid="save-word-button"]');
  }

  /**
   * Add a new phrase
   */
  async addPhrase(phrase: string, translation: string, language: string = 'en') {
    await this.page.click('[data-testid="add-phrase-button"]');
    await this.page.fill('[data-testid="phrase-input"]', phrase);
    await this.page.fill('[data-testid="translation-input"]', translation);
    await this.page.selectOption('[data-testid="language-select"]', language);
    await this.page.click('[data-testid="save-phrase-button"]');
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(url: string) {
    return await this.page.waitForResponse(response => 
      response.url().includes(url) && response.status() === 200
    );
  }

  /**
   * Take a screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}

/**
 * Common test data for language learning app
 */
export const TestData = {
  users: {
    valid: {
      email: 'test@example.com',
      password: 'testpassword123'
    },
    invalid: {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    }
  },
  words: {
    english: {
      word: 'hello',
      translation: 'hola',
      language: 'en'
    },
    spanish: {
      word: 'gracias',
      translation: 'thank you',
      language: 'es'
    }
  },
  phrases: {
    english: {
      phrase: 'How are you?',
      translation: '¿Cómo estás?',
      language: 'en'
    },
    spanish: {
      phrase: 'Buenos días',
      translation: 'Good morning',
      language: 'es'
    }
  }
};

/**
 * Common assertions for language learning app
 */
export class TestAssertions {
  constructor(private page: Page) {}

  /**
   * Assert that user is logged in
   */
  async assertUserIsLoggedIn() {
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="logout-button"]')).toBeVisible();
  }

  /**
   * Assert that user is logged out
   */
  async assertUserIsLoggedOut() {
    await expect(this.page.locator('[data-testid="login-button"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="register-button"]')).toBeVisible();
  }

  /**
   * Assert that a word appears in the words table
   */
  async assertWordInTable(word: string) {
    await expect(this.page.locator(`[data-testid="word-row"]:has-text("${word}")`)).toBeVisible();
  }

  /**
   * Assert that a phrase appears in the phrases table
   */
  async assertPhraseInTable(phrase: string) {
    await expect(this.page.locator(`[data-testid="phrase-row"]:has-text("${phrase}")`)).toBeVisible();
  }

  /**
   * Assert that an error message is displayed
   */
  async assertErrorMessage(message: string) {
    await expect(this.page.locator(`[data-testid="error-message"]:has-text("${message}")`)).toBeVisible();
  }

  /**
   * Assert that a success message is displayed
   */
  async assertSuccessMessage(message: string) {
    await expect(this.page.locator(`[data-testid="success-message"]:has-text("${message}")`)).toBeVisible();
  }
}
