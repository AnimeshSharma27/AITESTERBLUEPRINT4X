import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  
  // Selectors
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  readonly emailErrorMessage: Locator;
  readonly passwordErrorMessage: Locator;
  readonly genericErrorMessage: Locator;
  readonly pageTitle: Locator;
  readonly vwoLogo: Locator;
  readonly themeToggleButton: Locator;
  readonly passwordVisibilityToggle: Locator;
  readonly loadingSpinner: Locator;
  readonly formContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Email field and related elements
    this.emailField = page.locator('input[type="email"], input[placeholder*="email" i], input[aria-label*="email" i]').first();
    this.emailErrorMessage = page.locator('[data-testid="email-error"], .email-error, .error-message:has-text("email")').first();
    
    // Password field and related elements
    this.passwordField = page.locator('input[type="password"], input[placeholder*="password" i], input[aria-label*="password" i]').first();
    this.passwordErrorMessage = page.locator('[data-testid="password-error"], .password-error, .error-message:has-text("password")').first();
    this.passwordVisibilityToggle = page.locator('button[aria-label*="password" i], .password-toggle, [data-testid="password-visibility"]').first();
    
    // Login button
    this.loginButton = page.locator('button:has-text("Login"), button:has-text("Sign In"), button[type="submit"]').first();
    
    // Remember Me checkbox
    this.rememberMeCheckbox = page.locator('input[type="checkbox"], [role="checkbox"]').first();
    
    // Links
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("Reset"), a:has-text("Password")').first();
    this.signUpLink = page.locator('a:has-text("Sign Up"), a:has-text("Register"), a:has-text("Free")').first();
    
    // Error messages
    this.genericErrorMessage = page.locator('[role="alert"], .alert, .error-message').first();
    
    // Page elements
    this.pageTitle = page.locator('h1, .page-title').first();
    this.vwoLogo = page.locator('img[alt*="VWO"], .logo, [data-testid="logo"]').first();
    this.themeToggleButton = page.locator('button[aria-label*="theme" i], [data-testid="theme-toggle"], .theme-switcher').first();
    this.loadingSpinner = page.locator('[role="progressbar"], .spinner, .loading').first();
    this.formContainer = page.locator('form, .login-form, [role="form"]').first();
  }

  // Navigation
  async goto() {
    await this.page.goto('/#/login', { waitUntil: 'networkidle' });
  }

  async gotoForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async gotoSignUp() {
    await this.signUpLink.click();
  }

  // Email field interactions
  async enterEmail(email: string) {
    await this.emailField.clear();
    await this.emailField.fill(email);
  }

  async getEmailValue(): Promise<string> {
    return await this.emailField.inputValue();
  }

  async blurEmailField() {
    await this.emailField.blur();
  }

  async isEmailFieldFocused(): Promise<boolean> {
    return await this.emailField.evaluate(el => document.activeElement === el);
  }

  // Password field interactions
  async enterPassword(password: string) {
    await this.passwordField.clear();
    await this.passwordField.fill(password);
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordField.inputValue();
  }

  async blurPasswordField() {
    await this.passwordField.blur();
  }

  async isPasswordFieldFocused(): Promise<boolean> {
    return await this.passwordField.evaluate(el => document.activeElement === el);
  }

  async togglePasswordVisibility() {
    await this.passwordVisibilityToggle.click();
  }

  async isPasswordMasked(): Promise<boolean> {
    const type = await this.passwordField.getAttribute('type');
    return type === 'password';
  }

  // Form interactions
  async clickLoginButton() {
    await this.loginButton.click();
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return !(await this.loginButton.isDisabled());
  }

  async checkRememberMe() {
    const isChecked = await this.rememberMeCheckbox.isChecked();
    if (!isChecked) {
      await this.rememberMeCheckbox.click();
    }
  }

  async uncheckerMeMe() {
    const isChecked = await this.rememberMeCheckbox.isChecked();
    if (isChecked) {
      await this.rememberMeCheckbox.click();
    }
  }

  async isRememberMeChecked(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }

  // Complete login flow
  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    if (rememberMe) {
      await this.checkRememberMe();
    }
    await this.clickLoginButton();
  }

  // Error message interactions
  async getEmailErrorMessage(): Promise<string> {
    await this.emailErrorMessage.waitFor({ state: 'visible' });
    return await this.emailErrorMessage.textContent() || '';
  }

  async getPasswordErrorMessage(): Promise<string> {
    await this.passwordErrorMessage.waitFor({ state: 'visible' });
    return await this.passwordErrorMessage.textContent() || '';
  }

  async getGenericErrorMessage(): Promise<string> {
    await this.genericErrorMessage.waitFor({ state: 'visible' });
    return await this.genericErrorMessage.textContent() || '';
  }

  async isEmailErrorVisible(): Promise<boolean> {
    return await this.emailErrorMessage.isVisible().catch(() => false);
  }

  async isPasswordErrorVisible(): Promise<boolean> {
    return await this.passwordErrorMessage.isVisible().catch(() => false);
  }

  async isGenericErrorVisible(): Promise<boolean> {
    return await this.genericErrorMessage.isVisible().catch(() => false);
  }

  // Field validation
  async waitForEmailFieldValidation(timeout: number = 5000) {
    await this.page.waitForTimeout(500);
    await this.emailErrorMessage.waitFor({ state: 'visible', timeout }).catch(() => null);
  }

  async waitForPasswordFieldValidation(timeout: number = 5000) {
    await this.page.waitForTimeout(500);
    await this.passwordErrorMessage.waitFor({ state: 'visible', timeout }).catch(() => null);
  }

  // Page state checks
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.formContainer.isVisible();
  }

  async isPageLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isLoadingSpinnerVisible(): Promise<boolean> {
    return await this.loadingSpinner.isVisible().catch(() => false);
  }

  // Theme interactions
  async toggleTheme() {
    await this.themeToggleButton.click();
  }

  async getCurrentTheme(): Promise<string | null> {
    return await this.page.locator('html, body').getAttribute('class');
  }

  // Accessibility checks
  async getEmailFieldLabel(): Promise<string | null> {
    return await this.emailField.getAttribute('aria-label');
  }

  async getPasswordFieldLabel(): Promise<string | null> {
    return await this.passwordField.getAttribute('aria-label');
  }

  async getEmailFieldPlaceholder(): Promise<string | null> {
    return await this.emailField.getAttribute('placeholder');
  }

  async getPasswordFieldPlaceholder(): Promise<string | null> {
    return await this.passwordField.getAttribute('placeholder');
  }

  // Navigation checks
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForNavigation(timeout: number = 5000) {
    await this.page.waitForNavigation({ timeout });
  }

  async waitForRedirect(expectedUrl: string, timeout: number = 5000) {
    await this.page.waitForURL(expectedUrl, { timeout });
  }

  // Security checks
  async isHttpsConnection(): Promise<boolean> {
    return this.page.url().startsWith('https://');
  }

  async getPageSecurityStatus(): Promise<string> {
    const certificate = await this.page.evaluate(() => {
      return (window as any).sessionStorage.getItem('ssl_certificate');
    }).catch(() => null);
    return certificate || 'secure';
  }

  // Performance checks
  async getPageLoadMetrics() {
    return await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });
  }

  // Session checks
  async getSessionCookie(): Promise<string | null> {
    const cookies = await this.page.context().cookies();
    const sessionCookie = cookies.find(c => c.name.toLowerCase().includes('session') || c.name.toLowerCase().includes('auth'));
    return sessionCookie?.value || null;
  }

  async clearAllCookies() {
    await this.page.context().clearCookies();
  }

  // Utility methods
  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible().catch(() => false);
  }

  async getElementText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  async takeScreenshot(filename: string) {
    await this.page.screenshot({ path: `./test-results/screenshots/${filename}.png`, fullPage: true });
  }

  async focusEmailField() {
    await this.emailField.focus();
  }

  async focusPasswordField() {
    await this.passwordField.focus();
  }

  async tabToNextField() {
    await this.page.keyboard.press('Tab');
  }

  async pressEnter() {
    await this.page.keyboard.press('Enter');
  }

  async selectAllText() {
    await this.page.keyboard.press('Control+A');
  }

  async deleteText() {
    await this.page.keyboard.press('Delete');
  }
}
