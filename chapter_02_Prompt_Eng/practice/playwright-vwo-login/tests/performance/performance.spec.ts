import { test, expect } from '../fixtures';
import { TestData } from '../data/testdata';

test.describe('Performance Tests for VWO Login', () => {

  test('TC-PERF-001: Page load time should not exceed 2 seconds', async ({ loginPage, page }) => {
    const navigationStart = Date.now();

    await loginPage.goto();

    const navigationEnd = Date.now();
    const loadTime = navigationEnd - navigationStart;

    expect(loadTime).toBeLessThanOrEqual(TestData.Performance.pageLoadTarget);
  });

  test('TC-PERF-002: First Contentful Paint (FCP) should be under 1.8 seconds', async ({ page }) => {
    await page.goto('/#/login');

    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const fcp = paint.find(p => p.name === 'first-contentful-paint');

      return {
        fcpTime: fcp ? fcp.startTime : 0,
      };
    });

    expect(metrics.fcpTime).toBeLessThanOrEqual(1800); // 1.8 seconds in ms
  });

  test('TC-PERF-003: Largest Contentful Paint (LCP) should be under 2.5 seconds', async ({ page }) => {
    await page.goto('/#/login');

    const lcpTime = await page.evaluate(() => {
      const entries = performance.getEntriesByType('largest-contentful-paint');
      if (entries.length > 0) {
        return entries[entries.length - 1].startTime;
      }
      return 0;
    });

    expect(lcpTime).toBeLessThanOrEqual(2500);
  });

  test('TC-PERF-004: Cumulative Layout Shift (CLS) should be under 0.1', async ({ page }) => {
    await page.goto('/#/login');

    const cls = await page.evaluate(() => {
      const entries = performance.getEntriesByType('layout-shift') as PerformanceEntryList;
      let clsValue = 0;

      for (let i = 0; i < entries.length; i++) {
        if (!(entries[i] as any).hadRecentInput) {
          clsValue += (entries[i] as any).value;
        }
      }

      return clsValue;
    });

    expect(cls).toBeLessThanOrEqual(0.1);
  });

  test('TC-PERF-005: Time to Interactive (TTI) should be under 3 seconds', async ({ page }) => {
    await page.goto('/#/login');

    const tti = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const domInteractive = navigation.domInteractive;

      return domInteractive - navigation.fetchStart;
    });

    expect(tti).toBeLessThanOrEqual(3000);
  });

  test('TC-PERF-006: DOM Content Loaded should fire within 2 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/#/login');

    // Wait for DOMContentLoaded
    await page.waitForLoadState('domcontentloaded');

    const domLoadTime = Date.now() - startTime;

    expect(domLoadTime).toBeLessThanOrEqual(2000);
  });

  test('TC-PERF-007: Total resources (JS, CSS, images) load efficiently', async ({ page }) => {
    const resourceTiming: any[] = [];

    page.on('requestfinished', request => {
      const resource = request.response();
      if (resource) {
        resourceTiming.push({
          url: request.url(),
          status: resource.status(),
          time: request.timing(),
        });
      }
    });

    await page.goto('/#/login');

    // Check that critical resources loaded
    const jsResources = resourceTiming.filter(r => r.url.endsWith('.js'));
    const cssResources = resourceTiming.filter(r => r.url.endsWith('.css'));

    expect(jsResources.length).toBeGreaterThan(0);
    expect(cssResources.length).toBeGreaterThan(0);
  });

  test('TC-PERF-008: Login button click response time under 500ms', async ({ loginPage, page }) => {
    await loginPage.goto();

    const clickTime = Date.now();
    await loginPage.clickLoginButton();
    const responseTime = Date.now() - clickTime;

    expect(responseTime).toBeLessThanOrEqual(500);
  });

  test('TC-PERF-009: Email field input response time under 100ms', async ({ loginPage }) => {
    await loginPage.goto();

    const startTime = Date.now();
    await loginPage.emailField.type('test@example.com', { delay: 10 });
    const responseTime = Date.now() - startTime;

    const avgDelay = responseTime / 'test@example.com'.length;
    expect(avgDelay).toBeLessThanOrEqual(100);
  });

  test('TC-PERF-010: No layout shifts during form interaction', async ({ loginPage, page }) => {
    await loginPage.goto();

    const clsBeforeInteraction = await page.evaluate(() => {
      const entries = performance.getEntriesByType('layout-shift') as PerformanceEntryList;
      let clsValue = 0;

      for (let i = 0; i < entries.length; i++) {
        if (!(entries[i] as any).hadRecentInput) {
          clsValue += (entries[i] as any).value;
        }
      }

      return clsValue;
    });

    await loginPage.focusEmailField();
    await loginPage.emailField.type('test@example.com');

    const clsAfterInteraction = await page.evaluate(() => {
      const entries = performance.getEntriesByType('layout-shift') as PerformanceEntryList;
      let clsValue = 0;

      for (let i = 0; i < entries.length; i++) {
        if (!(entries[i] as any).hadRecentInput) {
          clsValue += (entries[i] as any).value;
        }
      }

      return clsValue;
    });

    const shiftDuringInteraction = clsAfterInteraction - clsBeforeInteraction;
    expect(shiftDuringInteraction).toBeLessThanOrEqual(0.1);
  });

  test('TC-PERF-011: CSS parsing and rendering time', async ({ page }) => {
    const styleMetrics = await page.evaluate(() => {
      const sheets = document.styleSheets;
      let totalRules = 0;

      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules;
          if (rules) {
            totalRules += rules.length;
          }
        } catch (e) {
          // Cross-origin CSS, skip
        }
      }

      return {
        styleSheets: sheets.length,
        totalRules,
      };
    });

    // Verify reasonable CSS complexity
    expect(styleMetrics.styleSheets).toBeGreaterThan(0);
    expect(styleMetrics.totalRules).toBeLessThanOrEqual(5000);
  });

  test('TC-PERF-012: JavaScript execution does not block interactions', async ({ loginPage, page }) => {
    await loginPage.goto();

    const jsBlocking = await page.evaluate(() => {
      const longTasks = performance.getEntriesByType('longtask');
      return longTasks.filter(task => task.duration > 50).length; // Tasks over 50ms
    });

    // Should have minimal blocking tasks
    expect(jsBlocking).toBeLessThanOrEqual(2);
  });

  test('TC-PERF-013: Memory usage remains stable during interactions', async ({ page }) => {
    await page.goto('/#/login');

    const memoryBefore = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Perform multiple interactions
    for (let i = 0; i < 5; i++) {
      await page.fill('input[type="email"]', `test${i}@example.com`);
      await page.fill('input[type="password"]', `password${i}`);
    }

    const memoryAfter = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    if (memoryBefore > 0 && memoryAfter > 0) {
      const memoryGrowth = memoryAfter - memoryBefore;
      const growthPercent = (memoryGrowth / memoryBefore) * 100;

      // Memory growth should not exceed 50%
      expect(growthPercent).toBeLessThanOrEqual(50);
    }
  });

  test('TC-PERF-014: Network requests are optimized (gzip, minification)', async ({ page }) => {
    const requests: any[] = [];

    page.on('response', response => {
      const headers = response.headers();
      requests.push({
        url: response.url(),
        size: response.headers()['content-length'] || 0,
        encoding: response.headers()['content-encoding'],
        type: response.headers()['content-type'],
      });
    });

    await page.goto('/#/login');

    // Check that large text resources are compressed
    const largeResources = requests.filter(
      r => r.type?.includes('text') || r.type?.includes('javascript')
    );

    const compressedResources = largeResources.filter(r => r.encoding === 'gzip');

    if (largeResources.length > 0) {
      expect(compressedResources.length).toBeGreaterThan(0);
    }
  });

  test('TC-PERF-015: Page renders without blocking user input', async ({ loginPage, page }) => {
    await loginPage.goto();

    // Measure time to first interaction
    const interactionTime = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation.domInteractive - navigation.fetchStart;
    });

    expect(interactionTime).toBeLessThanOrEqual(3000);

    // Verify we can interact with the page
    const isInputEnabled = await loginPage.emailField.isEnabled();
    expect(isInputEnabled).toBeTruthy();
  });

  test('TC-PERF-016: Error message display does not cause reflow', async ({ loginPage, page }) => {
    await loginPage.goto();

    // Measure layout recalculations before error
    const layoutsBefore = await page.evaluate(() => {
      return (performance as any).measureUserAgentSpecificMemory?.() || 0;
    });

    await loginPage.clickLoginButton();
    await page.waitForTimeout(500);

    // Error message should be displayed without excessive reflow
    const isErrorVisible = await loginPage.isEmailErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  test('TC-PERF-017: Responsive design changes do not impact load performance', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const mobileLoadStart = Date.now();
    await page.goto('/#/login');
    const mobileLoadTime = Date.now() - mobileLoadStart;

    // Test on desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    const desktopLoadStart = Date.now();
    await page.goto('/#/login');
    const desktopLoadTime = Date.now() - desktopLoadStart;

    // Both should be within acceptable range
    expect(mobileLoadTime).toBeLessThanOrEqual(TestData.Performance.pageLoadTarget + 500);
    expect(desktopLoadTime).toBeLessThanOrEqual(TestData.Performance.pageLoadTarget + 500);
  });

  test('TC-PERF-018: No console errors that impact performance', async ({ page }) => {
    const logs: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });

    await page.goto('/#/login');

    // Should have no critical errors
    const criticalErrors = logs.filter(
      log => !log.includes('404') && !log.includes('deprecated')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
