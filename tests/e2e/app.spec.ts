import { test, expect } from '@playwright/test';
import { TestUtils, TestData, TestAssertions } from '../utils/testUtils';

test.describe('Language Learning App - E2E Tests', () => {
  let testUtils: TestUtils;
  let assertions: TestAssertions;

  test.beforeEach(async ({ page }) => {
    testUtils = new TestUtils(page);
    assertions = new TestAssertions(page);
  });

  test.describe('Authentication Flow', () => {
    test('should display login page correctly', async ({ page }) => {
      await testUtils.navigateToPage('/login');
      
      await expect(page.locator('h1')).toContainText('Login');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should display register page correctly', async ({ page }) => {
      await testUtils.navigateToPage('/register');
      
      await expect(page.locator('h1')).toContainText('Register');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should navigate between login and register pages', async ({ page }) => {
      await testUtils.navigateToPage('/login');
      
      // Click on register link
      await page.click('text=Register');
      await expect(page).toHaveURL('/register');
      
      // Click on login link
      await page.click('text=Login');
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Words Management', () => {
    test('should display words table with empty state', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Check if words section is visible
      await expect(page.locator('text=Words')).toBeVisible();
      await expect(page.locator('text=No words yet. Start adding words to learn!')).toBeVisible();
    });

    test('should add a new word', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Add a new word
      const testWord = 'hello';
      await page.fill('input[placeholder="Enter a new word..."]', testWord);
      await page.click('button:has-text("Add")');
      
      // Verify word was added
      await expect(page.locator(`text=${testWord}`)).toBeVisible();
    });

    test('should not add empty word', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Try to add empty word
      await page.click('button:has-text("Add")');
      
      // Verify no word was added
      await expect(page.locator('text=No words yet. Start adding words to learn!')).toBeVisible();
    });

    test('should translate a word', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Add a word first
      const testWord = 'hello';
      await page.fill('input[placeholder="Enter a new word..."]', testWord);
      await page.click('button:has-text("Add")');
      
      // Click translate button
      await page.click('button:has-text("🌐 Translate")');
      
      // Verify translation is in progress
      await expect(page.locator('text=Translating...')).toBeVisible();
    });

    test('should delete a word', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Add a word first
      const testWord = 'hello';
      await page.fill('input[placeholder="Enter a new word..."]', testWord);
      await page.click('button:has-text("Add")');
      
      // Verify word exists
      await expect(page.locator(`text=${testWord}`)).toBeVisible();
      
      // Delete the word
      await page.click('button:has-text("🗑️")');
      
      // Verify word was deleted
      await expect(page.locator(`text=${testWord}`)).not.toBeVisible();
    });
  });

  test.describe('Phrases Management', () => {
    test('should display phrases table with empty state', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Check if phrases section is visible
      await expect(page.locator('text=Phrases')).toBeVisible();
      await expect(page.locator('text=No phrases yet. Start adding phrases to learn!')).toBeVisible();
    });

    test('should add a new phrase', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Add a new phrase
      const testPhrase = 'How are you?';
      await page.fill('input[placeholder="Enter a new phrase..."]', testPhrase);
      await page.click('button:has-text("Add"):nth-of-type(2)'); // Second Add button for phrases
      
      // Verify phrase was added
      await expect(page.locator(`text=${testPhrase}`)).toBeVisible();
    });

    test('should translate a phrase', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Add a phrase first
      const testPhrase = 'How are you?';
      await page.fill('input[placeholder="Enter a new phrase..."]', testPhrase);
      await page.click('button:has-text("Add"):nth-of-type(2)');
      
      // Click translate button for phrases
      await page.click('button:has-text("🌐 Translate"):nth-of-type(2)');
      
      // Verify translation is in progress
      await expect(page.locator('text=Translating...')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await testUtils.navigateToPage('/');
      
      // Verify main elements are visible on mobile
      await expect(page.locator('text=Words')).toBeVisible();
      await expect(page.locator('text=Phrases')).toBeVisible();
    });

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await testUtils.navigateToPage('/');
      
      // Verify main elements are visible on tablet
      await expect(page.locator('text=Words')).toBeVisible();
      await expect(page.locator('text=Phrases')).toBeVisible();
    });
  });

  test.describe('Dark Mode', () => {
    test('should toggle dark mode', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Look for dark mode toggle button (if it exists)
      const darkModeToggle = page.locator('button[aria-label*="dark"], button[aria-label*="theme"]');
      
      if (await darkModeToggle.count() > 0) {
        await darkModeToggle.click();
        
        // Verify dark mode is applied
        const body = page.locator('body');
        await expect(body).toHaveClass(/dark/);
      }
    });
  });
});
