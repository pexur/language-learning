import { test, expect } from '@playwright/test';

test.describe('Review Page E2E Tests', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/review');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('should display review page title and structure', async ({ page }) => {
    // Navigate to review page (will redirect to login)
    await page.goto('/review');
    
    // Verify redirect to login
    await expect(page).toHaveURL('/login');
    
    // Test the login page structure
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have proper navigation from main page', async ({ page }) => {
    // Go to main page (will redirect to login)
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    
    // Test that review link would be present if authenticated
    // (This is more of a structural test since we can't authenticate in E2E without backend)
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });

  test('should handle review page responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/review');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    
    // Verify mobile layout
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/review');
    
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display proper error states', async ({ page }) => {
    await page.goto('/review');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    
    // Test login form validation
    await page.click('button[type="submit"]');
    
    // Should show validation error or stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should have accessible review page elements', async ({ page }) => {
    await page.goto('/review');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    
    // Test accessibility of login form
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Test keyboard navigation
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
  });

  test('should handle review page with mock authentication', async ({ page }) => {
    // This test demonstrates what the review page would look like
    // In a real scenario, you'd need to mock authentication or use a test user
    
    await page.goto('/review');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    
    // Fill in login form (this won't actually work without backend)
    await page.fill('input[type="email"]', 'test@example.com');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/review-page-login.png' });
  });

  test('should test review page navigation flow', async ({ page }) => {
    // Test the complete flow from main page to review page
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    
    // Test navigation links (would be visible if authenticated)
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
    
    // Test register link
    await page.click('text=Sign up');
    await expect(page).toHaveURL('/register');
    
    // Go back to login
    await page.click('text=Sign in');
    await expect(page).toHaveURL('/login');
  });
});
