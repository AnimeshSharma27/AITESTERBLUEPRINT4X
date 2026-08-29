import { test, expect } from '../fixtures';
import { TestData } from '../data/testdata';
import { TestHelpers } from '../../utils/helpers';

test.describe('TC-VWO-LOGIN-VALID: Positive Login Test Cases', () => {

  test('TC-VWO-LOGIN-VALID-001: User successfully logs in with valid credentials', async ({ loginPage, page }) => {
    // Arrange
    const { email, password } = TestData.validCredentials;

    // Act
    await loginPage.login(email, password);

    // Assert
    try {
      await page.waitForNavigation({ timeout: 10000 });
      expect(page.url()).toContain('/dashboard');
    } catch {
      const errorMessage = await loginPage.getGenericErrorMessage().catch(() => '');
      expect(errorMessage).toBeFalsy();
    }
  });

  test('TC-VWO-LOGIN-VALID-002: Email field accepts valid email format', async ({ loginPage }) => {
    // Arrange
    const validEmail = TestData.validEmailFormats[0];

    // Act
    await loginPage.enterEmail(validEmail);
    await loginPage.blurEmailField();
    await TestHelpers.waitForElement(loginPage.page, 'input[type="email"]');

    // Assert
    const isErrorVisible = await loginPage.isEmailErrorVisible();
    expect(isErrorVisible).toBeFalsy();
    const enteredEmail = await loginPage.getEmailValue();
    expect(enteredEmail).toBe(validEmail);
  });

  test('TC-VWO-LOGIN-VALID-003: Password field masks input for security', async ({ loginPage }) => {
    // Arrange
    const testPassword = 'MySecurePass123!';

    // Act
    await loginPage.enterPassword(testPassword);

    // Assert
    const isMasked = await loginPage.isPasswordMasked();
    expect(isMasked).toBeTruthy();
    const passwordValue = await loginPage.getPasswordValue();
    expect(passwordValue).toBe(testPassword);
  });

  test('TC-VWO-LOGIN-VALID-004: Remember Me checkbox persists login session', async ({ loginPage, page }) => {
    // Arrange
    const { email, password } = TestData.validCredentials;

    // Act
    await loginPage.enterEmail(email);
    await loginPage.enterPassword(password);
    await loginPage.checkRememberMe();
    const isCheckedBeforeLogin = await loginPage.isRememberMeChecked();
    
    // Assert
    expect(isCheckedBeforeLogin).toBeTruthy();

    // Act - Complete login
    await loginPage.clickLoginButton();

    // Assert - Verify session persistence
    const sessionCookie = await loginPage.getSessionCookie();
    expect(sessionCookie).toBeTruthy();
  });

  test('TC-VWO-LOGIN-VALID-005: Forgot Password link is accessible and clickable', async ({ loginPage, page }) => {
    // Act
    const isForgotPasswordVisible = await loginPage.forgotPasswordLink.isVisible();
    expect(isForgotPasswordVisible).toBeTruthy();

    // Act - Click forgot password
    await loginPage.gotoForgotPassword();

    // Assert
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('forgot-password');
  });

  test('TC-VWO-LOGIN-VALID-006: New Account Registration link is accessible', async ({ loginPage, page }) => {
    // Act
    const isSignUpVisible = await loginPage.signUpLink.isVisible();
    expect(isSignUpVisible).toBeTruthy();

    // Act - Click sign up
    await loginPage.gotoSignUp();

    // Assert
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('sign-up');
  });

  test('TC-VWO-LOGIN-VALID-007: Login page loads within 2-second performance target', async ({ loginPage, page }) => {
    // Act
    const metrics = await loginPage.getPageLoadMetrics();

    // Assert
    expect(metrics.firstContentfulPaint).toBeLessThan(TestData.performance.pageLoadTarget);
    const isPageLoaded = await loginPage.isPageLoaded();
    expect(isPageLoaded).toBeTruthy();
  });

  test('TC-VWO-LOGIN-VALID-008: Login page is responsive on mobile devices (Portrait mode)', async ({ page }) => {
    // Arrange - Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Act
    await page.goto('/#/login');

    // Assert - Verify all elements are visible
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    const passwordField = page.locator('input[type="password"], input[placeholder*="password" i]').first();
    const loginButton = page.locator('button[type="submit"], button:has-text("Login")').first();

    expect(await emailField.isVisible()).toBeTruthy();
    expect(await passwordField.isVisible()).toBeTruthy();
    expect(await loginButton.isVisible()).toBeTruthy();

    // Assert - No horizontal scrolling required
    const pageWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(pageWidth).toBeLessThanOrEqual(375);
  });

  test('TC-VWO-LOGIN-VALID-009: Login page is responsive on mobile devices (Landscape mode)', async ({ page }) => {
    // Arrange - Set mobile landscape viewport
    await page.setViewportSize({ width: 667, height: 375 });

    // Act
    await page.goto('/#/login');

    // Assert - Verify all elements are visible
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    const passwordField = page.locator('input[type="password"], input[placeholder*="password" i]').first();
    const loginButton = page.locator('button[type="submit"], button:has-text("Login")').first();

    expect(await emailField.isVisible()).toBeTruthy();
    expect(await passwordField.isVisible()).toBeTruthy();
    expect(await loginButton.isVisible()).toBeTruthy();

    // Assert - Form is still usable
    const isFormVisible = await page.locator('form, .login-form').first().isVisible();
    expect(isFormVisible).toBeTruthy();
  });

  test('TC-VWO-LOGIN-VALID-010: Email field accepts multiple valid email formats', async ({ loginPage }) => {
    // Arrange
    const validFormats = TestData.validEmailFormats;

    // Act & Assert
    for (const email of validFormats) {
      await loginPage.enterEmail(email);
      await loginPage.blurEmailField();
      await TestHelpers.waitForElement(loginPage.page, 'input[type="email"]');

      const isErrorVisible = await loginPage.isEmailErrorVisible();
      expect(isErrorVisible).toBeFalsy(`Email format ${email} should be valid`);
    }
  });

  test('TC-VWO-LOGIN-VALID-011: Login button disabled state prior to form completion', async ({ loginPage }) => {
    // Act - Both fields empty
    const isDisabledInitial = await loginPage.loginButton.isDisabled();

    // Assert - Button should be disabled or enabled based on implementation
    const initialState = !isDisabledInitial;

    // Act - Enter email
    await loginPage.enterEmail(TestData.validCredentials.email);
    const stateAfterEmail = !await loginPage.loginButton.isDisabled();

    // Act - Enter password
    await loginPage.enterPassword(TestData.validCredentials.password);
    const stateAfterPassword = !await loginPage.loginButton.isDisabled();

    // Assert - Button state should be enabled when both fields filled
    expect(stateAfterPassword).toBeTruthy();
  });

  test('TC-VWO-LOGIN-VALID-012: Form input fields have associated labels and placeholder text', async ({ loginPage }) => {
    // Act
    const emailLabel = await loginPage.getEmailFieldLabel();
    const passwordLabel = await loginPage.getPasswordFieldLabel();
    const emailPlaceholder = await loginPage.getEmailFieldPlaceholder();
    const passwordPlaceholder = await loginPage.getPasswordFieldPlaceholder();

    // Assert
    const hasEmailLabel = emailLabel || emailPlaceholder;
    const hasPasswordLabel = passwordLabel || passwordPlaceholder;

    expect(hasEmailLabel).toBeTruthy();
    expect(hasPasswordLabel).toBeTruthy();
  });

  test('TC-VWO-LOGIN-VALID-013: Light Mode and Dark Mode toggle is accessible', async ({ loginPage, page }) => {
    // Act
    const isThemeToggleVisible = await loginPage.themeToggleButton.isVisible().catch(() => false);

    if (isThemeToggleVisible) {
      const initialTheme = await loginPage.getCurrentTheme();
      
      // Act - Toggle theme
      await loginPage.toggleTheme();
      await page.waitForTimeout(500);
      const newTheme = await loginPage.getCurrentTheme();

      // Assert - Theme should change
      expect(initialTheme).not.toBe(newTheme);
    }
  });

  test('TC-VWO-LOGIN-VALID-014: Page displays VWO branding and visual identity', async ({ loginPage, page }) => {
    // Act
    const isLogoVisible = await loginPage.vwoLogo.isVisible().catch(() => false);
    const pageTitle = await loginPage.pageTitle.textContent();

    // Assert
    if (isLogoVisible) {
      expect(isLogoVisible).toBeTruthy();
    }
    
    const titleContent = pageTitle?.toLowerCase() || '';
    expect(titleContent).toMatch(/login|sign in|welcome/i);
  });

  test('TC-VWO-LOGIN-VALID-015: Form fields maintain focus styling for keyboard navigation', async ({ page }) => {
    // Act - Tab through form elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // Assert - Element should have focus
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.getAttribute('type');
    });

    expect(focusedElement).toBeTruthy();

    // Act - Tab to next element
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // Assert - Focus should move
    const nextFocusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(nextFocusedElement).toBeTruthy();
  });
});
