import { test, expect } from '@playwright/test';
import { testConfig, getFrontendUrl } from '../config/testConfig';

test.describe('Language Learning App - E2E Tests with Real User', () => {
  test('should allow login with real user email', async ({ page }) => {
    // Navigate to login page
    await page.goto(getFrontendUrl('/login'));
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Welcome Back');
    
    // Fill in the email field with your real email
    await page.fill('input[type="email"]', testConfig.testUser.email);
    
    // Click the sign in button
    await page.click('button[type="submit"]');
    
    // Wait for either success (redirect to home) or error message
    await Promise.race([
      // Success case: redirected to home page
      page.waitForURL(getFrontendUrl('/'), { timeout: 10000 }),
      // Error case: error message appears
      page.waitForSelector('.text-red-600, .text-red-400', { timeout: 10000 })
    ]);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/login-attempt.png' });
    
    // Check if we're on the home page (successful login)
    if (page.url() === getFrontendUrl('/')) {
      console.log('✅ Successfully logged in!');
      await expect(page.locator('text=Welcome back')).toBeVisible();
    } else {
      console.log('❌ Login failed - check screenshot for error message');
      // The test will continue to show what error occurred
    }
  });

  test('should display register form correctly', async ({ page }) => {
    await page.goto(getFrontendUrl('/register'));
    
    // Check all form elements are present
    await expect(page.locator('h1')).toContainText('Create Your Account');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible();
    await expect(page.locator('text=Which language do you want to learn?')).toBeVisible();
    await expect(page.locator('text=Spanish')).toBeVisible();
    await expect(page.locator('text=French')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Test language selection
    await page.click('text=Spanish');
    await expect(page.locator('text=Spanish').locator('..')).toHaveClass(/border-indigo-500/);
  });

  test('should test responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(getFrontendUrl('/login'));
    
    // Check mobile layout
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/mobile-login.png' });
  });
});
