#!/usr/bin/env node

/**
 * Test Runner Script for Background Agents
 * 
 * This script provides an easy way for background agents to run specific tests
 * and get formatted output for analysis.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.projectRoot = process.cwd();
    this.testResultsDir = path.join(this.projectRoot, 'test-results');
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🧪 Running all Playwright tests...');
    try {
      execSync('npm run test', { stdio: 'inherit' });
      console.log('✅ All tests passed!');
      return { success: true, message: 'All tests passed' };
    } catch (error) {
      console.log('❌ Some tests failed');
      return { success: false, message: 'Some tests failed', error: error.message };
    }
  }

  /**
   * Run specific test file
   */
  async runTestFile(testFile) {
    console.log(`🧪 Running test file: ${testFile}`);
    try {
      execSync(`npx playwright test ${testFile}`, { stdio: 'inherit' });
      console.log(`✅ Test file ${testFile} passed!`);
      return { success: true, message: `Test file ${testFile} passed` };
    } catch (error) {
      console.log(`❌ Test file ${testFile} failed`);
      return { success: false, message: `Test file ${testFile} failed`, error: error.message };
    }
  }

  /**
   * Run tests for specific component
   */
  async runComponentTests(component) {
    const testFile = `tests/components/${component}.spec.ts`;
    if (!fs.existsSync(testFile)) {
      console.log(`⚠️  Test file not found: ${testFile}`);
      return { success: false, message: `Test file not found: ${testFile}` };
    }
    return await this.runTestFile(testFile);
  }

  /**
   * Run E2E tests
   */
  async runE2ETests() {
    console.log('🧪 Running E2E tests...');
    try {
      execSync('npx playwright test tests/e2e/', { stdio: 'inherit' });
      console.log('✅ E2E tests passed!');
      return { success: true, message: 'E2E tests passed' };
    } catch (error) {
      console.log('❌ E2E tests failed');
      return { success: false, message: 'E2E tests failed', error: error.message };
    }
  }

  /**
   * Run API tests
   */
  async runAPITests() {
    console.log('🧪 Running API tests...');
    try {
      execSync('npx playwright test tests/api/', { stdio: 'inherit' });
      console.log('✅ API tests passed!');
      return { success: true, message: 'API tests passed' };
    } catch (error) {
      console.log('❌ API tests failed');
      return { success: false, message: 'API tests failed', error: error.message };
    }
  }

  /**
   * Run tests in debug mode
   */
  async runDebugTests(testFile = '') {
    console.log('🐛 Running tests in debug mode...');
    try {
      const command = testFile ? `npm run test:debug -- ${testFile}` : 'npm run test:debug';
      execSync(command, { stdio: 'inherit' });
      return { success: true, message: 'Debug tests completed' };
    } catch (error) {
      return { success: false, message: 'Debug tests failed', error: error.message };
    }
  }

  /**
   * Generate test report
   */
  async generateReport() {
    console.log('📊 Generating test report...');
    try {
      execSync('npm run test:report', { stdio: 'inherit' });
      console.log('✅ Test report generated!');
      return { success: true, message: 'Test report generated' };
    } catch (error) {
      return { success: false, message: 'Failed to generate report', error: error.message };
    }
  }

  /**
   * List available tests
   */
  listTests() {
    const testDirs = ['tests/e2e', 'tests/api', 'tests/components'];
    const tests = [];

    testDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir)
          .filter(file => file.endsWith('.spec.ts') || file.endsWith('.test.ts'))
          .map(file => path.join(dir, file));
        tests.push(...files);
      }
    });

    console.log('📋 Available tests:');
    tests.forEach(test => console.log(`  - ${test}`));
    
    return tests;
  }

  /**
   * Check test environment
   */
  checkEnvironment() {
    console.log('🔍 Checking test environment...');
    
    const checks = [
      { name: 'Node.js', check: () => process.version },
      { name: 'npm', check: () => execSync('npm --version', { encoding: 'utf8' }).trim() },
      { name: 'Playwright', check: () => execSync('npx playwright --version', { encoding: 'utf8' }).trim() },
      { name: 'Test directory', check: () => fs.existsSync('tests') ? 'exists' : 'missing' },
      { name: 'Playwright config', check: () => fs.existsSync('playwright.config.ts') ? 'exists' : 'missing' }
    ];

    checks.forEach(({ name, check }) => {
      try {
        const result = check();
        console.log(`  ✅ ${name}: ${result}`);
      } catch (error) {
        console.log(`  ❌ ${name}: ${error.message}`);
      }
    });
  }
}

// CLI Interface
if (require.main === module) {
  const runner = new TestRunner();
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'all':
      runner.runAllTests();
      break;
    case 'e2e':
      runner.runE2ETests();
      break;
    case 'api':
      runner.runAPITests();
      break;
    case 'component':
      if (!arg) {
        console.log('❌ Please specify component name');
        process.exit(1);
      }
      runner.runComponentTests(arg);
      break;
    case 'file':
      if (!arg) {
        console.log('❌ Please specify test file path');
        process.exit(1);
      }
      runner.runTestFile(arg);
      break;
    case 'debug':
      runner.runDebugTests(arg);
      break;
    case 'report':
      runner.generateReport();
      break;
    case 'list':
      runner.listTests();
      break;
    case 'check':
      runner.checkEnvironment();
      break;
    default:
      console.log(`
🧪 Playwright Test Runner for Background Agents

Usage: node test-runner.js <command> [argument]

Commands:
  all                    Run all tests
  e2e                   Run E2E tests
  api                   Run API tests
  component <name>       Run component tests
  file <path>           Run specific test file
  debug [file]          Run tests in debug mode
  report                Generate test report
  list                  List available tests
  check                 Check test environment

Examples:
  node test-runner.js all
  node test-runner.js component WordsTable
  node test-runner.js file tests/e2e/app.spec.ts
  node test-runner.js debug tests/api/api.spec.ts
      `);
  }
}

module.exports = TestRunner;
