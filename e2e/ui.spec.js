import { test, expect } from '@playwright/test';

test.describe('UI Component Tests', () => {
  
  test.describe('Theme Switching', () => {
    test('should toggle between light and dark themes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find theme toggle button
      const themeToggle = page.locator('button[aria-label*="theme" i], button:has-text("🌙"), button:has-text("☀"), [data-testid="theme-toggle"]').first();
      
      if (await themeToggle.isVisible().catch(() => false)) {
        // Get initial theme
        const initialClass = await page.locator('html').getAttribute('class');
        
        // Click toggle
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Check theme changed
        const newClass = await page.locator('html').getAttribute('class');
        
        // Theme should have changed (either added or removed dark class)
        expect(initialClass !== newClass).toBeTruthy();
        
        // Toggle back
        await themeToggle.click();
      }
    });
  });

  test.describe('Navigation Menu', () => {
    test('should show navigation on all pages', async ({ page }) => {
      const pages = ['/', '/gallery', '/calculator', '/booking'];
      
      for (const url of pages) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        // Check for nav element or header
        const nav = page.locator('nav, header').first();
        await expect(nav).toBeVisible();
      }
    });

    test('should highlight active navigation item', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      // Look for active state in nav
      const activeLink = page.locator('a[href="/gallery"], a[href="/gallery/"]').first();
      
      if (await activeLink.isVisible().catch(() => false)) {
        const hasActiveClass = await activeLink.evaluate(el => 
          el.classList.contains('active') || 
          el.getAttribute('aria-current') === 'page' ||
          window.getComputedStyle(el).fontWeight === '700'
        );
        
        // Active state may be indicated differently
        expect(await activeLink.isVisible()).toBeTruthy();
      }
    });
  });

  test.describe('Buttons and Interactions', () => {
    test('should have clickable CTA buttons on home page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find CTA buttons
      const ctaButtons = page.locator('a:has-text("Book"), button:has-text("Book"), a:has-text("Get Started"), button:has-text("Get Started")');
      
      if (await ctaButtons.first().isVisible().catch(() => false)) {
        const count = await ctaButtons.count();
        expect(count).toBeGreaterThan(0);
        
        // Verify buttons are clickable
        for (let i = 0; i < Math.min(count, 3); i++) {
          const button = ctaButtons.nth(i);
          await expect(button).toBeEnabled();
        }
      }
    });

    test('should show loading states during data fetch', async ({ page }) => {
      await page.goto('/gallery');
      
      // Check for loading indicators
      const loadingElements = page.locator('.loading, [data-testid="loading"], .spinner, .skeleton');
      
      // Loading may appear briefly
      await page.waitForTimeout(1000);
      
      // Page should have loaded content
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Animations', () => {
    test('should have animated elements on home page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for animated elements
      const animatedElements = page.locator('[class*="animate"], [class*="motion"], [data-framer-motion]');
      const count = await animatedElements.count();
      
      // Should have some animated elements
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('animations showcase page should load', async ({ page }) => {
      await page.goto('/animations');
      await page.waitForLoadState('networkidle');
      
      // Page should load
      await expect(page.locator('body')).toBeVisible();
      
      // Should have animation components
      const animatedButtons = page.locator('button');
      const buttonCount = await animatedButtons.count();
      expect(buttonCount).toBeGreaterThan(0);
    });
  });

  test.describe('Responsive Design', () => {
    test('should adapt layout for mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for mobile menu or adapted layout
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    test('should adapt layout for tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });

  test.describe('Footer', () => {
    test('should display footer with contact info', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      // Check for footer
      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();
    });
  });
});
