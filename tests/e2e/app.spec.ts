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
      
      await expect(page.locator('h1')).toContainText('Welcome Back');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should display register page correctly', async ({ page }) => {
      await testUtils.navigateToPage('/register');
      
      await expect(page.locator('h1')).toContainText('Create Your Account');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should navigate between login and register pages', async ({ page }) => {
      await testUtils.navigateToPage('/login');
      
      // Click on register link
      await page.click('text=Sign up');
      await expect(page).toHaveURL('/register');
      
      // Click on login link
      await page.click('text=Sign in');
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Words Management', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await testUtils.navigateToPage('/');
      
      // Should redirect to login page
      await expect(page).toHaveURL('/login');
      await expect(page.locator('h1')).toContainText('Welcome Back');
    });

    test('should display login form correctly', async ({ page }) => {
      await testUtils.navigateToPage('/login');
      
      // Check login form elements
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
    });

    test('should display register form correctly', async ({ page }) => {
      await testUtils.navigateToPage('/register');
      
      // Check register form elements
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      await expect(page.locator('text=Create Account')).toBeVisible();
    });
  });


  test.describe('Phrases Management', () => {
    test('should display language selection in register form', async ({ page }) => {
      await testUtils.navigateToPage('/register');
      
      // Check if both language selection sections are visible
      await expect(page.locator('text=Your Native Language')).toBeVisible();
      await expect(page.locator('text=Language You Want to Learn')).toBeVisible();
      await expect(page.locator('text=Spanish')).toBeVisible();
      await expect(page.locator('text=French')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await testUtils.navigateToPage('/login');
      
      // Verify main elements are visible on mobile
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await testUtils.navigateToPage('/login');
      
      // Verify main elements are visible on tablet
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
    });
  });
});
