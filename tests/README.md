# Playwright Testing Guide for Background Agents

This guide helps background agents write and run browser tests for the Language Learning App using Playwright.

## Quick Start

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

## Test Structure

```
tests/
├── e2e/           # End-to-end tests
├── api/           # API tests
├── components/    # Component tests
├── utils/         # Test utilities
└── fixtures/      # Test data
```

## Writing Tests

### 1. E2E Tests (`tests/e2e/`)

E2E tests simulate real user interactions with the browser.

```typescript
import { test, expect } from '@playwright/test';
import { TestUtils, TestAssertions } from '../utils/testUtils';

test('should add a new word', async ({ page }) => {
  const testUtils = new TestUtils(page);
  const assertions = new TestAssertions(page);
  
  await testUtils.navigateToPage('/');
  await testUtils.addWord('hello', 'hola', 'en');
  await assertions.assertWordInTable('hello');
});
```

### 2. API Tests (`tests/api/`)

API tests verify backend functionality without browser.

```typescript
import { test, expect } from '@playwright/test';

test('should create a new word', async ({ request }) => {
  const response = await request.post('/api/words', {
    headers: { 'Authorization': `Bearer ${token}` },
    data: { text: 'hello', language: 'en' }
  });
  
  expect(response.status()).toBe(201);
});
```

### 3. Component Tests (`tests/components/`)

Component tests focus on specific UI components.

```typescript
import { test, expect } from '@playwright/test';

test('WordsTable should display empty state', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=No words yet')).toBeVisible();
});
```

## Test Utilities

### TestUtils Class
- `navigateToPage(path)` - Navigate and wait for load
- `login(email, password)` - Login with credentials
- `addWord(word, translation, language)` - Add a word
- `addPhrase(phrase, translation, language)` - Add a phrase
- `waitForApiResponse(url)` - Wait for API call
- `takeScreenshot(name)` - Take screenshot for debugging

### TestAssertions Class
- `assertUserIsLoggedIn()` - Check login state
- `assertUserIsLoggedOut()` - Check logout state
- `assertWordInTable(word)` - Check word exists
- `assertPhraseInTable(phrase)` - Check phrase exists
- `assertErrorMessage(message)` - Check error message
- `assertSuccessMessage(message)` - Check success message

### TestData Object
Pre-defined test data for consistent testing:

```typescript
import { TestData } from '../utils/testUtils';

// Use test data
const user = TestData.users.valid;
const word = TestData.words.english;
const phrase = TestData.phrases.english;
```

## Best Practices

### 1. Use Data Test IDs
Add `data-testid` attributes to elements for reliable selection:

```tsx
<button data-testid="add-word-button">Add Word</button>
<input data-testid="word-input" />
```

### 2. Wait for Elements
Always wait for elements to be visible before interacting:

```typescript
await expect(page.locator('[data-testid="word-input"]')).toBeVisible();
await page.fill('[data-testid="word-input"]', 'hello');
```

### 3. Handle Async Operations
Wait for API calls and state updates:

```typescript
await testUtils.waitForApiResponse('/api/words');
await page.waitForLoadState('networkidle');
```

### 4. Use Page Object Pattern
Create page objects for complex pages:

```typescript
class LoginPage {
  constructor(private page: Page) {}
  
  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }
}
```

### 5. Test Different Scenarios
- Happy path (normal user flow)
- Error cases (invalid input, network errors)
- Edge cases (empty states, loading states)
- Different user roles and permissions

## Common Test Patterns

### Authentication Flow
```typescript
test('complete login flow', async ({ page }) => {
  const testUtils = new TestUtils(page);
  const assertions = new TestAssertions(page);
  
  await testUtils.navigateToPage('/login');
  await testUtils.login('test@example.com', 'password123');
  await assertions.assertUserIsLoggedIn();
});
```

### CRUD Operations
```typescript
test('word CRUD operations', async ({ page }) => {
  const testUtils = new TestUtils(page);
  const assertions = new TestAssertions(page);
  
  // Create
  await testUtils.addWord('hello', 'hola', 'en');
  await assertions.assertWordInTable('hello');
  
  // Update (translate)
  await page.click('[data-testid="translate-button"]');
  await expect(page.locator('text=hola')).toBeVisible();
  
  // Delete
  await page.click('[data-testid="delete-button"]');
  await expect(page.locator('text=hello')).not.toBeVisible();
});
```

### Form Validation
```typescript
test('form validation', async ({ page }) => {
  await page.goto('/register');
  
  // Submit empty form
  await page.click('[data-testid="register-button"]');
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  
  // Fill invalid email
  await page.fill('[data-testid="email"]', 'invalid-email');
  await page.click('[data-testid="register-button"]');
  await expect(page.locator('text=Invalid email')).toBeVisible();
});
```

## Debugging Tests

### 1. Screenshots
```typescript
await page.screenshot({ path: 'debug-screenshot.png' });
```

### 2. Console Logs
```typescript
page.on('console', msg => console.log(msg.text()));
```

### 3. Network Requests
```typescript
page.on('request', request => console.log(request.url()));
page.on('response', response => console.log(response.url(), response.status()));
```

### 4. Debug Mode
```bash
npm run test:debug
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Scheduled runs

### GitHub Actions
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test
```

## Environment Configuration

### Test Environment Variables
- `NEXT_PUBLIC_BASE_URL` - Base URL for tests
- `TEST_USER_EMAIL` - Test user email
- `TEST_USER_PASSWORD` - Test user password
- `API_BASE_URL` - API base URL

### Different Environments
- Local: `http://localhost:3000`
- Staging: `https://staging.yourapp.com`
- Production: `https://yourapp.com`

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in config
   - Add proper waits
   - Check for slow operations

2. **Elements not found**
   - Add data-testid attributes
   - Wait for elements to load
   - Check for dynamic content

3. **API calls failing**
   - Verify API endpoints
   - Check authentication
   - Mock external services

4. **Flaky tests**
   - Add proper waits
   - Use deterministic data
   - Avoid race conditions

### Getting Help
- Check Playwright documentation
- Look at existing test examples
- Use debug mode to step through tests
- Check test reports for detailed error information

## Example Test Templates

### Basic Page Test
```typescript
import { test, expect } from '@playwright/test';

test('page loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

### Form Test
```typescript
import { test, expect } from '@playwright/test';

test('form submission', async ({ page }) => {
  await page.goto('/form');
  await page.fill('[data-testid="input"]', 'test value');
  await page.click('[data-testid="submit"]');
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});
```

### API Test
```typescript
import { test, expect } from '@playwright/test';

test('API endpoint', async ({ request }) => {
  const response = await request.get('/api/data');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('items');
});
```

This guide provides everything needed for background agents to write effective browser tests for the Language Learning App.
