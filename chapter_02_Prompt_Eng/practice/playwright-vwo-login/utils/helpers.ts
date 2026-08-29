import { Page } from '@playwright/test';

export class TestHelpers {
  /**
   * Wait for element to appear and be ready for interaction
   */
  static async waitForElement(page: Page, selector: string, timeout = 5000) {
    await page.waitForSelector(selector, { timeout });
  }

  /**
   * Verify element contains expected text
   */
  static async verifyElementText(page: Page, selector: string, expectedText: string): Promise<boolean> {
    const element = page.locator(selector);
    const text = await element.textContent();
    return text?.toLowerCase().includes(expectedText.toLowerCase()) || false;
  }

  /**
   * Get all error messages on page
   */
  static async getAllErrorMessages(page: Page): Promise<string[]> {
    const errorElements = page.locator('[role="alert"], .error, .error-message');
    const count = await errorElements.count();
    const errors: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await errorElements.nth(i).textContent();
      if (text) errors.push(text.trim());
    }

    return errors;
  }

  /**
   * Check if error message matches patterns
   */
  static matchesErrorPattern(errorMessage: string, patterns: string[]): boolean {
    return patterns.some(pattern =>
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Get all cookies from page
   */
  static async getAllCookies(page: Page): Promise<any[]> {
    return await page.context().cookies();
  }

  /**
   * Get specific cookie by name
   */
  static async getCookie(page: Page, cookieName: string): Promise<any | null> {
    const cookies = await page.context().cookies();
    return cookies.find(c => c.name === cookieName) || null;
  }

  /**
   * Delete specific cookie
   */
  static async deleteCookie(page: Page, cookieName: string) {
    const cookies = await page.context().cookies();
    const cookiesToKeep = cookies.filter(c => c.name !== cookieName);
    await page.context().clearCookies();
    for (const cookie of cookiesToKeep) {
      await page.context().addCookies([cookie]);
    }
  }

  /**
   * Verify HTTPS connection
   */
  static isHttpsConnection(url: string): boolean {
    return url.startsWith('https://');
  }

  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: Page, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Get page load time metrics
   */
  static async getPageMetrics(page: Page) {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        startTime: navigation.startTime,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        duration: navigation.duration,
      };
    });
  }

  /**
   * Check if element has specific class
   */
  static async hasClass(page: Page, selector: string, className: string): Promise<boolean> {
    const element = page.locator(selector);
    const classes = await element.getAttribute('class');
    return classes?.split(' ').includes(className) || false;
  }

  /**
   * Add class to element (for testing purposes)
   */
  static async addClass(page: Page, selector: string, className: string) {
    await page.evaluate(({ selector, className }) => {
      const element = document.querySelector(selector);
      element?.classList.add(className);
    }, { selector, className });
  }

  /**
   * Remove class from element
   */
  static async removeClass(page: Page, selector: string, className: string) {
    await page.evaluate(({ selector, className }) => {
      const element = document.querySelector(selector);
      element?.classList.remove(className);
    }, { selector, className });
  }

  /**
   * Get computed style of element
   */
  static async getComputedStyle(page: Page, selector: string, property: string): Promise<string> {
    return await page.evaluate(({ selector, property }) => {
      const element = document.querySelector(selector);
      return window.getComputedStyle(element!).getPropertyValue(property);
    }, { selector, property });
  }

  /**
   * Check if element is visible in viewport
   */
  static async isInViewport(page: Page, selector: string): Promise<boolean> {
    return await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
    }, selector);
  }

  /**
   * Scroll element into view
   */
  static async scrollIntoView(page: Page, selector: string) {
    await page.evaluate((selector) => {
      document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    }, selector);
  }

  /**
   * Set localStorage value
   */
  static async setLocalStorage(page: Page, key: string, value: string) {
    await page.evaluate(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key, value });
  }

  /**
   * Get localStorage value
   */
  static async getLocalStorage(page: Page, key: string): Promise<string | null> {
    return await page.evaluate((key) => {
      return localStorage.getItem(key);
    }, key);
  }

  /**
   * Clear localStorage
   */
  static async clearLocalStorage(page: Page) {
    await page.evaluate(() => {
      localStorage.clear();
    });
  }

  /**
   * Take screenshot
   */
  static async takeScreenshot(page: Page, filename: string) {
    const path = `./test-results/screenshots/${filename}.png`;
    await page.screenshot({ path, fullPage: true });
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `test.${timestamp}.${random}@example.com`;
  }

  /**
   * Generate random password
   */
  static generateRandomPassword(length = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Wait for network idle
   */
  static async waitForNetworkIdle(page: Page, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Log message to console
   */
  static log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }

  /**
   * Retry async function with exponential backoff
   */
  static async retry(
    fn: () => Promise<any>,
    maxAttempts = 3,
    delayMs = 1000
  ): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        this.log(`Attempt ${attempt}/${maxAttempts} failed: ${lastError.message}`, 'warn');
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
      }
    }

    throw new Error(`Failed after ${maxAttempts} attempts: ${lastError?.message}`);
  }

  /**
   * Compare color contrast ratio
   */
  static getContrastRatio(rgb1: string, rgb2: string): number {
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(x => {
        x = x / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const parse = (rgb: string) => {
      const match = rgb.match(/\d+/g);
      return match ? match.map(Number) : [0, 0, 0];
    };

    const [r1, g1, b1] = parse(rgb1);
    const [r2, g2, b2] = parse(rgb2);
    const lum1 = getLuminance(r1, g1, b1);
    const lum2 = getLuminance(r2, g2, b2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }
}
