// Test configuration for Playwright with AWS API Gateway
export const testConfig = {
  // Frontend URL (where Next.js is running)
  frontendUrl: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  
  // AWS API Gateway URL (get this from your AWS console or deployment output)
  // Format: https://{api-id}.execute-api.{region}.amazonaws.com/{stage}
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://mbxdcn33vj.execute-api.us-west-2.amazonaws.com/dev',
  
  // Test user credentials (for automated testing)
  testUser: {
    email: process.env.TEST_USER_EMAIL || 'xzy377@outlook.com',
    password: process.env.TEST_USER_PASSWORD || 'testpassword123',
    name: 'Test User',
    targetLanguage: 'Spanish'
  },
  
  // Test data
  testData: {
    word: 'hello',
    translation: 'hola',
    phrase: 'How are you?',
    phraseTranslation: '¿Cómo estás?'
  },
  
  // Playwright settings
  timeout: parseInt(process.env.PLAYWRIGHT_TIMEOUT || '30000'),
  retries: parseInt(process.env.PLAYWRIGHT_RETRIES || '2')
};

// Helper function to get API endpoint
export function getApiEndpoint(path: string): string {
  return `${testConfig.apiUrl}${path}`;
}

// Helper function to get frontend URL
export function getFrontendUrl(path: string = ''): string {
  return `${testConfig.frontendUrl}${path}`;
}
