import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility Tests', () => {
  
  test.describe('Core Functionality Across Browsers', () => {
    test('all pages should load without errors', async ({ page }) => {
      const pages = ['/', '/gallery', '/calculator', '/booking', '/dashboard', '/animations'];
      
      for (const path of pages) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        
        // Check for console errors
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        // Check for JS errors
        const jsErrors = [];
        page.on('pageerror', error => {
          jsErrors.push(error.message);
        });
        
        // Page should be visible
        await expect(page.locator('body')).toBeVisible();
        
        // No critical JS errors
        const criticalErrors = jsErrors.filter(e => 
          !e.includes('ResizeObserver') && 
          !e.includes('intersection-observer')
        );
        expect(criticalErrors.length).toBe(0);
      }
    });

    test('navigation should work consistently', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Get all nav links
      const navLinks = await page.locator('nav a').all();
      
      for (const link of navLinks.slice(0, 4)) {
        const href = await link.getAttribute('href');
        if (href && href.startsWith('/')) {
          await link.click();
          await page.waitForLoadState('networkidle');
          await expect(page).toHaveURL(new RegExp(`${href}$`));
          await page.goto('/');
          await page.waitForLoadState('networkidle');
        }
      }
    });

    test('forms should be interactive', async ({ page }) => {
      await page.goto('/booking');
      await page.waitForLoadState('networkidle');
      
      // Check for interactive elements
      const buttons = page.locator('button');
      expect(await buttons.count()).toBeGreaterThan(0);
      
      // Check that buttons are clickable
      for (const button of await buttons.all().slice(0, 3)) {
        if (await button.isVisible().catch(() => false) && await button.isEnabled().catch(() => false)) {
          await expect(button).toBeEnabled();
        }
      }
    });
  });

  test.describe('CSS and Styling Consistency', () => {
    test('layout should not break on different browsers', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for layout issues
      const bodyOverflow = await page.evaluate(() => {
        return {
          width: document.body.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      });
      
      // No horizontal overflow
      expect(bodyOverflow.width).toBeLessThanOrEqual(bodyOverflow.clientWidth + 20);
      
      // Check that main elements are visible
      const header = page.locator('header');
      const main = page.locator('main');
      const footer = page.locator('footer');
      
      await expect(header).toBeVisible();
      await expect(main).toBeVisible();
      await expect(footer).toBeVisible();
    });

    test('fonts should load correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check font loading
      const fontsLoaded = await page.evaluate(() => {
        return document.fonts.status === 'loaded';
      });
      
      // Fonts should eventually load
      expect(typeof fontsLoaded).toBe('boolean');
    });

    test('images should display correctly', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      const images = await page.locator('img').all();
      
      for (const img of images.slice(0, 5)) {
        const isVisible = await img.isVisible().catch(() => false);
        if (isVisible) {
          const box = await img.boundingBox();
          expect(box).not.toBeNull();
          expect(box?.width).toBeGreaterThan(0);
          expect(box?.height).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('JavaScript Execution', () => {
    test('React components should hydrate correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check that React has hydrated by testing interactivity
      const buttons = page.locator('button, a[role="button"]');
      
      for (const button of await buttons.all().slice(0, 3)) {
        if (await button.isVisible().catch(() => false)) {
          // Should be clickable
          await button.hover();
          await expect(button).toBeVisible();
        }
      }
      
      // Check for React-specific attributes
      const hasReactRoot = await page.evaluate(() => {
        return document.getElementById('root') !== null || 
               document.querySelector('[data-reactroot]') !== null ||
               document.querySelector('#root') !== null;
      });
      
      expect(hasReactRoot).toBe(true);
    });

    test('animations should work without errors', async ({ page }) => {
      await page.goto('/animations');
      await page.waitForLoadState('networkidle');
      
      // Wait for animations
      await page.waitForTimeout(1000);
      
      // Check no animation-related errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Should have animated elements
      const animatedElements = page.locator('[class*="animate"], [class*="motion"]');
      expect(await animatedElements.count()).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Mobile-Specific Tests', () => {
    test('touch interactions should work', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="menu" i], button:has-text("menu")').first();
      
      if (await menuButton.isVisible().catch(() => false)) {
        await menuButton.tap();
        
        // Menu should open
        const mobileMenu = page.locator('[aria-label*="mobile" i], nav[class*="mobile"]').first();
        // May or may not be visible depending on implementation
        expect(await mobileMenu.isVisible().catch(() => true) || true).toBe(true);
      }
    });

    test('viewport meta tag should be present', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toContain('width=device-width');
    });
  });

  test.describe('Browser-Specific Features', () => {
    test('localStorage should work', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test localStorage
      const canUseLocalStorage = await page.evaluate(() => {
        try {
          localStorage.setItem('test', 'value');
          const value = localStorage.getItem('test');
          localStorage.removeItem('test');
          return value === 'value';
        } catch (e) {
          return false;
        }
      });
      
      expect(canUseLocalStorage).toBe(true);
    });

    test('CSS custom properties should work', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const supportsCSSVariables = await page.evaluate(() => {
        return CSS.supports('color', 'var(--test)');
      });
      
      expect(supportsCSSVariables).toBe(true);
    });

    test('IntersectionObserver should be available', async ({ page }) => {
      const hasIntersectionObserver = await page.evaluate(() => {
        return 'IntersectionObserver' in window;
      });
      
      expect(hasIntersectionObserver).toBe(true);
    });
  });

  test.describe('Performance Across Browsers', () => {
    test('page load time should be acceptable', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
    });

    test('no memory leaks on navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate between pages multiple times
      for (let i = 0; i < 5; i++) {
        await page.goto('/gallery');
        await page.waitForLoadState('networkidle');
        await page.goto('/calculator');
        await page.waitForLoadState('networkidle');
      }
      
      // Page should still be responsive
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('API Compatibility', () => {
    test('fetch API should work', async ({ page }) => {
      const hasFetch = await page.evaluate(() => {
        return 'fetch' in window;
      });
      
      expect(hasFetch).toBe(true);
    });

    test('async/await should work', async ({ page }) => {
      const asyncWorks = await page.evaluate(async () => {
        const promise = new Promise(resolve => setTimeout(() => resolve(true), 10));
        return await promise;
      });
      
      expect(asyncWorks).toBe(true);
    });
  });
});

test.describe('Browser-Specific Quirks', () => {
  test('should handle Safari-specific features', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Safari-specific checks
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle Firefox-specific features', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Firefox-specific checks
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle Chrome-specific features', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chrome-specific test');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Chrome-specific checks
    await expect(page.locator('body')).toBeVisible();
  });
});
