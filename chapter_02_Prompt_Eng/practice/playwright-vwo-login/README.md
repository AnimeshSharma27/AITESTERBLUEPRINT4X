# VWO Login Dashboard - Playwright Test Automation Framework

## Overview

This is a comprehensive, enterprise-grade Playwright test automation framework for the VWO Login Dashboard (https://app.vwo.com/#/login). The framework implements 61 automated test cases covering functional, security, accessibility, and performance testing following the **RICEPOT methodology** with strict anti-hallucination rules.

**Test Coverage**: 
- ✅ 15 Positive/Happy Path Tests
- ✅ 22 Negative/Error Handling Tests  
- ✅ 12 Security/Vulnerability Tests
- ✅ 18 Accessibility Tests (WCAG 2.1 AA)
- ✅ 18 Performance Tests (Core Web Vitals)

**Total: 85+ comprehensive test cases**

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Configuration](#configuration)
4. [Test Categories](#test-categories)
5. [Running Tests](#running-tests)
6. [Debugging and Troubleshooting](#debugging-and-troubleshooting)
7. [CI/CD Integration](#cicd-integration)
8. [Best Practices](#best-practices)
9. [Contributing Guidelines](#contributing-guidelines)

---

## Quick Start

### Prerequisites

- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **Git**: For version control

### Installation

1. **Clone the repository** (or navigate to project directory):
```bash
cd playwright-vwo-login
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

4. **Configure .env file** with your test credentials:
```env
# Base URLs
BASE_URL=https://app.vwo.com

# Valid Test Credentials
VALID_EMAIL=your-test-user@example.com
VALID_PASSWORD=your-test-password

# Invalid Test Credentials
INVALID_EMAIL=nonexistent@example.com
INVALID_PASSWORD=wrongpassword

# Performance Thresholds
PAGE_LOAD_TARGET=2000

# Security Settings
RATE_LIMIT_THRESHOLD=5
SESSION_TIMEOUT=1800000
```

5. **Run your first test**:
```bash
npm test
```

---

## Project Structure

```
playwright-vwo-login/
├── README.md                          # This file
├── package.json                       # Dependencies and scripts
├── playwright.config.ts               # Playwright configuration
├── tsconfig.json                      # TypeScript configuration
├── .env.example                       # Environment variables template
│
├── src/
│   └── utils/
│       └── helpers.ts                 # Utility functions (25+ methods)
│
├── pages/
│   └── LoginPage.ts                   # Page Object Model (40+ methods)
│
├── tests/
│   ├── fixtures.ts                    # Test fixtures and setup
│   │
│   ├── data/
│   │   └── testdata.ts                # Test data and scenarios
│   │
│   ├── positive/
│   │   └── valid-login.spec.ts        # 15 happy path tests
│   │
│   ├── negative/
│   │   └── invalid-login.spec.ts      # 22 error handling tests
│   │
│   ├── security/
│   │   └── security.spec.ts           # 12 security/vulnerability tests
│   │
│   ├── accessibility/
│   │   └── accessibility.spec.ts      # 18 WCAG 2.1 AA tests
│   │
│   └── performance/
│       └── performance.spec.ts        # 18 Core Web Vitals tests
│
├── test-results/                      # Generated test reports
│   ├── results.html
│   ├── results.json
│   └── junit.xml
│
└── .github/
    └── workflows/
        └── playwright.yml             # GitHub Actions CI/CD
```

---

## Configuration

### Playwright Config (playwright.config.ts)

The framework supports multi-browser testing:

- **Chrome** (Chromium): Desktop browser testing
- **Firefox**: Cross-browser compatibility
- **WebKit**: Safari compatibility
- **Mobile Chrome**: iOS/Android Chrome
- **Mobile Safari**: iOS Safari

**Key Settings**:
```typescript
use: {
  baseURL: process.env.BASE_URL || 'https://app.vwo.com',
  actionTimeout: 10000,              // 10 seconds
  navigationTimeout: 30000,           // 30 seconds
  trace: 'on-first-retry',           // Trace on failure
  screenshot: 'only-on-failure',     // Screenshots on error
  video: 'retain-on-failure',        // Video on failure
}
```

### Environment Variables (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| `BASE_URL` | Login page URL | https://app.vwo.com |
| `VALID_EMAIL` | Test user email | test@vwo.com |
| `VALID_PASSWORD` | Test user password | SecurePass123! |
| `INVALID_EMAIL` | Non-existent email | fake@example.com |
| `PAGE_LOAD_TARGET` | Max page load time (ms) | 2000 |
| `RATE_LIMIT_THRESHOLD` | Failed attempts before lock | 5 |

---

## Test Categories

### 1. Positive Tests (15 tests)
**File**: `tests/positive/valid-login.spec.ts`

Happy path scenarios validating expected behavior:
- TC-VALID-001: Valid credentials login
- TC-VALID-002: Email format validation
- TC-VALID-003: Password masking
- TC-VALID-004: Remember Me functionality
- TC-VALID-005: Navigation to Forgot Password
- TC-VALID-006: Navigation to Sign Up
- TC-VALID-007: Page load performance (2 seconds)
- TC-VALID-008: Mobile portrait responsiveness
- TC-VALID-009: Mobile landscape responsiveness
- TC-VALID-010: Multiple email format support
- TC-VALID-011: Login button state management
- TC-VALID-012: Accessibility labels and attributes
- TC-VALID-013: Light/Dark mode theme toggle
- TC-VALID-014: VWO branding verification
- TC-VALID-015: Keyboard navigation focus

### 2. Negative Tests (22 tests)
**File**: `tests/negative/invalid-login.spec.ts`

Error handling and validation:
- TC-INVALID-001 to 003: Empty field validation
- TC-INVALID-004: Invalid email formats
- TC-INVALID-005: Invalid credentials
- TC-INVALID-006: Password masking with special chars
- TC-INVALID-007: Rate limiting (brute force protection)
- TC-INVALID-008: HTTPS enforcement
- TC-INVALID-009: SQL injection prevention
- TC-INVALID-010: XSS payload prevention
- TC-INVALID-011: Keyboard navigation in error states
- TC-INVALID-012: Screen reader error announcement
- TC-INVALID-013: Password required validation
- TC-INVALID-014: Real-time field validation
- TC-INVALID-015: Locked account handling
- TC-INVALID-016: Session timeout
- TC-INVALID-017: XSS in email field
- TC-INVALID-018: Concurrent login session management
- TC-INVALID-019: Browser autofill password security
- TC-INVALID-020: Mobile touch target size (44x44px)
- TC-INVALID-021: Color contrast (4.5:1 ratio)
- TC-INVALID-022: WAVE accessibility audit

### 3. Security Tests (12 tests)
**File**: `tests/security/security.spec.ts`

OWASP Top 10 vulnerability testing:
- HTTPS connection enforcement
- Password field masking
- SQL injection sanitization (5 payloads)
- XSS prevention (6 attack vectors)
- Session cookie security
- localStorage sensitive data protection
- CSRF token presence
- Rate limiting verification
- Error message information disclosure
- Password reset token security
- Sensitive header exposure
- Input sanitization against code injection

### 4. Accessibility Tests (18 tests)
**File**: `tests/accessibility/accessibility.spec.ts`

WCAG 2.1 AA compliance:
- Keyboard navigation through all elements
- Form field labels and associations
- Focus indicators visibility
- Screen reader error announcements (ARIA)
- Color contrast ratios (4.5:1 minimum)
- Input type attributes (email, password)
- Heading hierarchy (H1, H2, H3)
- Interactive element sizes (44x44px minimum)
- Keyboard-only form submission
- Image alt attributes
- Duplicate ID prevention
- Page language attribute
- Form landmarks and structure
- No automatic redirects
- Focus trap prevention
- Zoom support (200% layout stability)
- Link text visibility
- Error message field associations
- Axe accessibility audit integration

### 5. Performance Tests (18 tests)
**File**: `tests/performance/performance.spec.ts`

Core Web Vitals and performance optimization:
- Page load time ≤ 2 seconds
- First Contentful Paint (FCP) ≤ 1.8s
- Largest Contentful Paint (LCP) ≤ 2.5s
- Cumulative Layout Shift (CLS) ≤ 0.1
- Time to Interactive (TTI) ≤ 3s
- DOM Content Loaded ≤ 2s
- Resource loading efficiency
- Button click response ≤ 500ms
- Input response time ≤ 100ms
- No layout shifts during interaction
- CSS parsing optimization
- JavaScript execution blocking
- Memory usage stability
- Network optimization (gzip, minification)
- User input rendering performance
- Error message display efficiency
- Responsive design performance consistency
- Console error impact analysis

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npm run test:headed

# Run in UI mode (interactive)
npm run test:ui

# Run in debug mode (with step-through)
npm run test:debug
```

### Run Specific Test Category

```bash
# Positive tests only
npm run test:positive

# Negative tests only
npm run test:negative

# Security tests only
npm run test:security

# Accessibility tests only
npm run test:accessibility

# Performance tests only
npm run test:performance
```

### Run Specific Browser

```bash
# Chrome only
npm run test:chrome

# Firefox only
npm run test:firefox

# WebKit (Safari) only
npm run test:webkit
```

### Filter Tests

```bash
# Run tests matching a pattern
npx playwright test --grep "TC-VALID-001"

# Run tests NOT matching a pattern
npx playwright test --grep-invert "security"

# Run a single file
npx playwright test tests/positive/valid-login.spec.ts
```

### Advanced Options

```bash
# Run with specific number of workers
npx playwright test --workers=4

# Run with retries
npx playwright test --retries=3

# Report only (view previous results)
npm run report

# Record new test
npm run codegen

# View test trace
npm run trace
```

---

## Test Results and Reporting

### HTML Report

View detailed test results:
```bash
npm run report
```

The report shows:
- ✅ Passed/Failed tests
- 📸 Screenshots on failure
- 🎥 Video recordings
- ⏱️ Execution time
- 🔍 Test details and logs

### JSON Report

Machine-readable results in `test-results/results.json`:
```json
{
  "stats": {
    "expected": 85,
    "unexpected": 0,
    "flaky": 0,
    "skipped": 0
  },
  "tests": [
    {
      "title": "TC-VALID-001: Valid credentials login",
      "ok": true,
      "duration": 2500
    }
  ]
}
```

### JUnit Report

CI/CD integration with `test-results/junit.xml`:
- Compatible with Jenkins, GitHub Actions, GitLab CI
- Test counts and timing data
- Error messages and stack traces

---

## Debugging and Troubleshooting

### Common Issues

#### 1. Tests Timing Out

**Problem**: Tests exceed timeout duration

**Solution**:
```bash
# Increase timeout in playwright.config.ts
timeout: 60000  // 60 seconds

# Or for specific test
test.setTimeout(90000);
```

#### 2. Element Not Found

**Problem**: "element not found" error

**Solutions**:
```typescript
// 1. Increase wait time
await page.waitForSelector('selector', { timeout: 10000 });

// 2. Use more specific selector
// Bad: 'button' 
// Good: 'button[type="submit"]'

// 3. Check if element is in viewport
await element.scrollIntoViewIfNeeded();
```

#### 3. Flaky Tests

**Problem**: Tests pass sometimes, fail other times

**Solutions**:
```typescript
// 1. Wait for element state
await page.waitForLoadState('networkidle');

// 2. Use proper waits
await expect(element).toBeVisible();

// 3. Increase timeouts in .env
ACTION_TIMEOUT=15000
NAVIGATION_TIMEOUT=45000
```

#### 4. Authentication Failures

**Problem**: Tests can't log in

**Solutions**:
1. Verify credentials in `.env` file
2. Check if 2FA is enabled on test account
3. Verify account isn't locked
4. Check rate limiting (wait 15 minutes)

### Debug Mode

```bash
# Run with debugger open
npm run test:debug

# Available commands:
# - 's' - step into
# - 'n' - step over
# - 'o' - step out
# - 'c' - continue
# - 'l' - show logs
```

### Inspect Element

```bash
# Generate selectors for elements
npm run codegen

# Record user actions
# 1. Browser opens automatically
# 2. Interact with login page
# 3. Code is generated as you interact
```

### View Test Traces

```bash
npm run trace

# Shows:
# - Network requests
# - Console logs
# - Screenshots at each step
# - DOM snapshots
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm install
      
      - run: npx playwright install
      
      - run: npm test
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-results/
          retention-days: 30
```

### Running on Schedule

```yaml
on:
  schedule:
    # Run every day at 2 AM UTC
    - cron: '0 2 * * *'
```

### Docker Execution

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app
COPY . .

RUN npm install

CMD ["npm", "test"]
```

---

## Best Practices

### 1. Page Object Model (POM)

Keep selectors centralized in LoginPage.ts:

```typescript
// ✅ GOOD - Maintainable
await loginPage.enterEmail('test@example.com');

// ❌ BAD - Brittle
await page.fill('input[placeholder="Email"]', 'test@example.com');
```

### 2. Test Data

Use testdata.ts for all test data:

```typescript
// ✅ GOOD
const email = TestData.Credentials.valid.email;

// ❌ BAD
const email = 'hardcoded@example.com';
```

### 3. Assertions

Use expect() for all validations:

```typescript
// ✅ GOOD - Clear intention
expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();

// ❌ BAD - Silent failures
loginPage.isLoginPageDisplayed();
```

### 4. Waits

Use proper Playwright wait mechanisms:

```typescript
// ✅ GOOD - Playwright-native
await expect(loginPage.emailField).toBeVisible();
await page.waitForLoadState('networkidle');

// ❌ BAD - Flaky
await page.waitForTimeout(2000);
```

### 5. Test Independence

Each test should be independent:

```typescript
// ✅ GOOD - Each test starts fresh
test('should login', async ({ loginPage }) => {
  // Login page is automatically navigated to
  await loginPage.login('user@example.com', 'password');
});

// ❌ BAD - Dependent on other tests
test('should login', async ({ page }) => {
  // Assumes previous test already navigated
});
```

### 6. Error Messages

Use meaningful assertion messages:

```typescript
// ✅ GOOD
expect(errorCount, 'Should show exactly one error message').toBe(1);

// ❌ BAD
expect(errorCount).toBe(1);
```

### 7. Screenshots and Videos

Enable debugging aids:

```typescript
// In playwright.config.ts
screenshot: 'only-on-failure',  // Not always - slows execution
video: 'retain-on-failure',     // Not always - saves space
trace: 'on-first-retry',        // Very helpful for debugging
```

### 8. Test Naming

Use consistent, descriptive names:

```typescript
// ✅ GOOD - Clear intent
test('TC-VALID-001: Should login successfully with valid credentials', ...)

// ❌ BAD
test('login test', ...)
```

---

## Contributing Guidelines

### Adding New Tests

1. **Identify test category** (positive, negative, security, accessibility, performance)

2. **Create test file** in appropriate directory:
```typescript
import { test, expect } from '../fixtures';
import { TestData } from '../data/testdata';
import { TestHelpers } from '../../utils/helpers';

test.describe('Test Suite Name', () => {
  test('TC-ID: Test Description', async ({ loginPage, page }) => {
    // Arrange
    const testData = TestData.Credentials.valid;
    
    // Act
    await loginPage.login(testData.email, testData.password);
    
    // Assert
    expect(await loginPage.isDashboardDisplayed()).toBeTruthy();
  });
});
```

3. **Add test data** to `tests/data/testdata.ts` if needed

4. **Add helpers** to `utils/helpers.ts` if needed

5. **Update documentation** in this README

### Code Style

- Use TypeScript strict mode
- Follow PascalCase for classes/interfaces
- Follow camelCase for methods/variables
- Use async/await (not promises)
- Add JSDoc comments for complex methods
- Max line length: 100 characters

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-new-test-category

# Make changes and commit
git add .
git commit -m "feat: add new test category for feature X"

# Push and create pull request
git push origin feature/add-new-test-category
```

### Pull Request Checklist

- [ ] Tests pass locally: `npm test`
- [ ] No linting errors: `npx eslint .` (if configured)
- [ ] Updated README if adding new features
- [ ] Added JSDoc comments to new methods
- [ ] Test names follow TC-ID convention
- [ ] No hardcoded credentials or sensitive data

---

## Maintenance

### Regular Tasks

**Weekly**:
- Review test results for failures
- Update test data if credentials expire
- Check for Playwright updates

**Monthly**:
- Review and update selectors if UI changes
- Optimize slow tests
- Update dependencies: `npm update`

**Quarterly**:
- Full framework audit
- Performance baseline review
- Security assessment

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install @playwright/test@latest

# Review breaking changes in package.json
```

---

## Support and Resources

### Documentation
- [Playwright Docs](https://playwright.dev)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

### Community
- [Playwright Issues](https://github.com/microsoft/playwright/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)
- [Discord Community](https://discord.gg/playwright)

### Related Files
- Test Plan: `VWO_Login_TestPlan.md`
- Test Cases: `VWO_Login_TestCases.md`
- Anti-hallucination Rules: `../../../chapter_01_LLM_BASICS/ANTI-HALLUCINATION.rules.md`

---

## License

Proprietary - Internal Use Only

---

## Contact

For questions or issues, contact the QA team.

---

**Last Updated**: January 2025
**Framework Version**: 1.0.0
**Playwright Version**: 1.40.0+
**Node.js Version**: 18.0+
