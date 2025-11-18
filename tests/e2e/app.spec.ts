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
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
      
      await expect(page.locator('h1')).toContainText('Welcome Back', { timeout: 10000 });
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });
    });

    test('should display register page correctly', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('domcontentloaded');
      
      await expect(page.locator('h1')).toContainText('Create Your Account', { timeout: 10000 });
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });
    });

    test('should navigate between login and register pages', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
      
      // Click on register link
      await page.locator('text=Sign up').click({ timeout: 10000 });
      await expect(page).toHaveURL(/\/register/, { timeout: 10000 });
      
      // Click on login link
      await page.locator('text=Sign in').click({ timeout: 10000 });
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });
  });

  test.describe('Words Management', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Should redirect to login page
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
      await expect(page.locator('h1')).toContainText('Welcome Back', { timeout: 10000 });
    });

    test('should display login form correctly', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
      
      // Check login form elements
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button[type="submit"]')).toContainText('Sign In', { timeout: 10000 });
    });

    test('should display register form correctly', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('domcontentloaded');
      
      // Check register form elements
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Create Account')).toBeVisible({ timeout: 10000 });
    });
  });


  test.describe('Phrases Management', () => {
    test('should display language selection in register form', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('domcontentloaded');
      
      // Check if both language selection sections are visible
      await expect(page.locator('text=Your Native Language')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Language You Want to Learn')).toBeVisible({ timeout: 10000 });
      // Check for language options in select dropdowns
      await expect(page.locator('select').first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator('select').nth(1)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
      
      // Verify main elements are visible on mobile
      await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    });

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
      
      // Verify main elements are visible on tablet
      await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    });
  });
});
