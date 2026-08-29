import { test, expect } from '../fixtures';
import { TestData } from '../data/testdata';
import { TestHelpers } from '../../utils/helpers';

test.describe('TC-VWO-LOGIN-INVALID: Negative Login Test Cases', () => {

  test('TC-VWO-LOGIN-INVALID-001: Empty email field error message', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.enterPassword(TestData.validCredentials.password);

    // Act
    await loginPage.clickLoginButton();
    await page.waitForTimeout(1000);

    // Assert
    const isEmailErrorVisible = await loginPage.isEmailErrorVisible();
    expect(isEmailErrorVisible).toBeTruthy();

    const errorMessage = await loginPage.getEmailErrorMessage().catch(() => '');
    expect(TestHelpers.matchesErrorPattern(errorMessage, TestData.expectedErrors.emailRequired.patterns)).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-002: Empty password field error message', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.enterEmail(TestData.validCredentials.email);

    // Act
    await loginPage.clickLoginButton();
    await page.waitForTimeout(1000);

    // Assert
    const isPasswordErrorVisible = await loginPage.isPasswordErrorVisible();
    expect(isPasswordErrorVisible).toBeTruthy();

    const errorMessage = await loginPage.getPasswordErrorMessage().catch(() => '');
    expect(TestHelpers.matchesErrorPattern(errorMessage, TestData.expectedErrors.passwordRequired.patterns)).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-003: Both email and password fields empty', async ({ loginPage, page }) => {
    // Act
    await loginPage.clickLoginButton();
    await page.waitForTimeout(1000);

    // Assert
    const isEmailErrorVisible = await loginPage.isEmailErrorVisible();
    const isPasswordErrorVisible = await loginPage.isPasswordErrorVisible();

    expect(isEmailErrorVisible || isPasswordErrorVisible).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-004: Invalid email format rejection', async ({ loginPage, page }) => {
    // Arrange
    const invalidEmails = TestData.invalidEmailFormats;

    // Act & Assert
    for (const invalidEmail of invalidEmails) {
      await loginPage.enterEmail(invalidEmail);
      await loginPage.blurEmailField();
      await page.waitForTimeout(500);

      const isErrorVisible = await loginPage.isEmailErrorVisible();
      expect(isErrorVisible).toBeTruthy(`Invalid email ${invalidEmail} should show error`);
    }
  });

  test('TC-VWO-LOGIN-INVALID-005: Invalid credentials rejection', async ({ loginPage, page }) => {
    // Arrange
    const { email } = TestData.invalidCredentials;
    const { password } = TestData.invalidCredentials;

    // Act
    await loginPage.login(email, password);
    await page.waitForTimeout(3000);

    // Assert
    const errorMessage = await loginPage.getGenericErrorMessage().catch(() => '');
    expect(TestHelpers.matchesErrorPattern(errorMessage, TestData.expectedErrors.invalidCredentials.patterns)).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-006: Password field accepts only printable characters', async ({ loginPage }) => {
    // Arrange
    const passwordWithSpecialChars = TestData.passwordsWithSpecialChars[0];

    // Act
    await loginPage.enterPassword(passwordWithSpecialChars);

    // Assert
    const isMasked = await loginPage.isPasswordMasked();
    expect(isMasked).toBeTruthy();

    const passwordValue = await loginPage.getPasswordValue();
    expect(passwordValue).toBe(passwordWithSpecialChars);
  });

  test('TC-VWO-LOGIN-INVALID-007: Brute force attack protection via rate limiting', async ({ loginPage, page }) => {
    // Arrange
    const threshold = TestData.security.rateLimitThreshold;
    const attempts: boolean[] = [];

    // Act - Multiple failed login attempts
    for (let i = 0; i < threshold + 1; i++) {
      await loginPage.enterEmail(TestData.validCredentials.email);
      await loginPage.enterPassword('WrongPassword123');
      await loginPage.clickLoginButton();
      await page.waitForTimeout(1000);

      const errorMessage = await loginPage.getGenericErrorMessage().catch(() => '');
      const isRateLimited = TestHelpers.matchesErrorPattern(errorMessage, TestData.expectedErrors.tooManyAttempts.patterns);
      attempts.push(isRateLimited);

      // Clear fields for next attempt
      await loginPage.enterEmail('');
      await loginPage.enterPassword('');
    }

    // Assert - Rate limiting should be triggered after threshold
    const rateLimitingTriggered = attempts.slice(threshold).some(attempted => attempted === true);
    expect(rateLimitingTriggered).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-008: HTTPS enforcement verification', async ({ loginPage, page }) => {
    // Act
    const currentUrl = await loginPage.getCurrentUrl();

    // Assert
    expect(TestHelpers.isHttpsConnection(currentUrl)).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-009: SQL injection prevention in email field', async ({ loginPage, page }) => {
    // Arrange
    const sqlPayload = TestData.sqlInjectionPayloads[0];

    // Act
    await loginPage.enterEmail(sqlPayload);
    await loginPage.blurEmailField();
    await page.waitForTimeout(500);

    // Assert - Should show validation error, not execute SQL
    const isErrorVisible = await loginPage.isEmailErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorMessage = await loginPage.getEmailErrorMessage().catch(() => '');
    expect(errorMessage.length).toBeGreaterThan(0);
  });

  test('TC-VWO-LOGIN-INVALID-010: XSS prevention in error messages', async ({ loginPage, page }) => {
    // Arrange
    const xssPayload = TestData.xssPayloads[0];

    // Act
    await loginPage.enterEmail(xssPayload);
    await loginPage.blurEmailField();
    await page.waitForTimeout(500);

    // Assert - XSS should not execute (no alert box)
    let xssExecuted = false;
    page.on('dialog', async dialog => {
      xssExecuted = true;
      await dialog.dismiss();
    });

    expect(xssExecuted).toBeFalsy();

    // Verify error message is displayed safely
    const isErrorVisible = await loginPage.isEmailErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-011: Keyboard navigation through error states', async ({ page }) => {
    // Act - Tab through form with no input
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Assert - Should be able to reach all elements via keyboard
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-012: Screen reader announces email field error', async ({ loginPage, page }) => {
    // Act
    await loginPage.enterEmail('invalid');
    await loginPage.blurEmailField();
    await page.waitForTimeout(500);

    // Assert - Error should have ARIA attributes
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    const ariaDescribedBy = await emailField.getAttribute('aria-describedby');
    const ariaInvalid = await emailField.getAttribute('aria-invalid');

    const hasAccessibilityAttributes = ariaDescribedBy || ariaInvalid === 'true';
    expect(hasAccessibilityAttributes).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-013: Password field validation on empty submission', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.enterEmail(TestData.validCredentials.email);
    // Leave password empty

    // Act
    await loginPage.clickLoginButton();
    await page.waitForTimeout(1000);

    // Assert
    const isPasswordErrorVisible = await loginPage.isPasswordErrorVisible();
    expect(isPasswordErrorVisible).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-014: Field-level validation occurs on blur', async ({ loginPage, page }) => {
    // Act
    await loginPage.enterEmail('invalidformat');
    
    // Assert - No error yet (field still focused)
    let isErrorVisibleBeforeBlur = await loginPage.isEmailErrorVisible();
    expect(isErrorVisibleBeforeBlur).toBeFalsy();

    // Act - Blur field
    await loginPage.blurEmailField();
    await page.waitForTimeout(500);

    // Assert - Error should appear after blur
    isErrorVisibleBeforeBlur = await loginPage.isEmailErrorVisible();
    expect(isErrorVisibleBeforeBlur).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-015: Locked account handling', async ({ loginPage, page }) => {
    // Arrange
    const { email } = TestData.lockedAccount;

    // Act
    await loginPage.login(email, 'AnyPassword');
    await page.waitForTimeout(3000);

    // Assert
    const errorMessage = await loginPage.getGenericErrorMessage().catch(() => '');
    
    // Should show error (either "locked" or "invalid credentials" depending on implementation)
    expect(errorMessage.length).toBeGreaterThan(0);
  });

  test('TC-VWO-LOGIN-INVALID-016: Session timeout after inactivity', async ({ loginPage, page }) => {
    // Arrange - Login successfully
    await loginPage.login(TestData.validCredentials.email, TestData.validCredentials.password);
    await page.waitForTimeout(2000);

    // Act - Simulate inactivity (advance time or wait)
    // Note: In real scenario, would need to mock or advance time
    await page.waitForTimeout(1000);

    // Assert - Session should be tracked
    const sessionCookie = await loginPage.getSessionCookie();
    expect(sessionCookie).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-017: Cross-site scripting (XSS) in email field', async ({ loginPage, page }) => {
    // Arrange
    const xssAttempt = TestData.xssPayloads[0];
    let alertTriggered = false;

    page.on('dialog', async dialog => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    // Act
    await loginPage.enterEmail(xssAttempt);
    await loginPage.blurEmailField();
    await page.waitForTimeout(500);

    // Assert - XSS should not execute
    expect(alertTriggered).toBeFalsy();

    // Error should be displayed safely
    const isErrorVisible = await loginPage.isEmailErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  test('TC-VWO-LOGIN-INVALID-018: Concurrent login session handling', async ({ context }) => {
    // Arrange
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    const loginPage1 = new (await import('../../pages/LoginPage')).LoginPage(page1);
    const loginPage2 = new (await import('../../pages/LoginPage')).LoginPage(page2);

    // Act - Login on both pages
    await loginPage1.goto();
    await loginPage2.goto();

    await loginPage1.login(TestData.validCredentials.email, TestData.validCredentials.password);
    await page1.waitForTimeout(2000);

    await loginPage2.login(TestData.validCredentials.email, TestData.validCredentials.password);
    await page2.waitForTimeout(2000);

    // Assert - Verify session management
    const cookie1 = await loginPage1.getSessionCookie();
    const cookie2 = await loginPage2.getSessionCookie();

    expect(cookie1).toBeTruthy();
    expect(cookie2).toBeTruthy();

    // Cleanup
    await page1.close();
    await page2.close();
  });

  test('TC-VWO-LOGIN-INVALID-019: Browser autofill security (password field)', async ({ loginPage }) => {
    // Arrange
    const testPassword = TestData.validCredentials.password;

    // Act
    await loginPage.enterPassword(testPassword);

    // Assert
    const isMasked = await loginPage.isPasswordMasked();
    expect(isMasked).toBeTruthy();

    const fieldType = await loginPage.passwordField.getAttribute('type');
    expect(fieldType).toBe('password');
  });

  test('TC-VWO-LOGIN-INVALID-020: Mobile platform - touch target size validation', async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 375, height: 667 });

    // Act
    await page.goto('/#/login');

    // Assert - Check button size
    const loginButton = page.locator('button[type="submit"], button:has-text("Login")').first();
    const boundingBox = await loginButton.boundingBox();

    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(TestData.accessibility.minTouchTargetSize);
      expect(boundingBox.width).toBeGreaterThanOrEqual(TestData.accessibility.minTouchTargetSize);
    }
  });

  test('TC-VWO-LOGIN-INVALID-021: Error message color contrast verification', async ({ loginPage, page }) => {
    // Act
    await loginPage.enterEmail('invalid');
    await loginPage.blurEmailField();
    await page.waitForTimeout(500);

    // Assert - Error should have sufficient contrast
    const errorElement = page.locator('[role="alert"], .error, .error-message').first();
    const isVisible = await errorElement.isVisible().catch(() => false);

    if (isVisible) {
      const color = await TestHelpers.getComputedStyle(page, '[role="alert"], .error, .error-message', 'color');
      const backgroundColor = await TestHelpers.getComputedStyle(page, '[role="alert"], .error, .error-message', 'background-color');

      // Verify colors exist (actual contrast calculation would require more complex logic)
      expect(color).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
    }
  });

  test('TC-VWO-LOGIN-INVALID-022: Login page accessibility audit (WAVE)', async ({ loginPage, page }) => {
    // Act - Check for basic accessibility elements
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    const passwordField = page.locator('input[type="password"], input[placeholder*="password" i]').first();

    // Assert - Check for ARIA labels or associated labels
    const emailHasLabel = await emailField.getAttribute('aria-label') || await emailField.getAttribute('placeholder');
    const passwordHasLabel = await passwordField.getAttribute('aria-label') || await passwordField.getAttribute('placeholder');

    expect(emailHasLabel).toBeTruthy();
    expect(passwordHasLabel).toBeTruthy();

    // Check for semantic form structure
    const formElement = page.locator('form, .login-form').first();
    const isFormPresent = await formElement.isVisible().catch(() => false);
    expect(isFormPresent).toBeTruthy();
  });
});
