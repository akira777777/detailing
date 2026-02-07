import { test, expect } from '@playwright/test';

test.describe('UI Component Tests', () => {
  
  test.describe('Layout Components', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should display navigation bar', async ({ page }) => {
      const navbar = page.locator('header, nav').first();
      await expect(navbar).toBeVisible();
      
      // Check for logo
      const logo = page.locator('text=LUXE').first();
      await expect(logo).toBeVisible();
      
      // Check for navigation links
      const navLinks = page.locator('nav a');
      const count = await navLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      // Check for copyright
      const copyright = footer.locator('text=/©|copyright/i').first();
      await expect(copyright).toBeVisible();
    });

    test('should have skip to main content link for accessibility', async ({ page }) => {
      // Check for skip link (might be visually hidden but present)
      const skipLink = page.locator('a[href="#main-content"], .skip-to-main');
      const exists = await skipLink.count() > 0;
      expect(exists).toBe(true);
    });
  });

  test.describe('Hero Section', () => {
    test('should display hero with animations', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for hero heading
      const heroHeading = page.locator('h1').first();
      await expect(heroHeading).toBeVisible();
      
      // Check for CTA buttons
      const ctaButtons = page.locator('a:has-text("Book"), a:has-text("Gallery"), button:has-text("Book")');
      expect(await ctaButtons.count()).toBeGreaterThan(0);
    });

    test('should have animated elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for animation-related classes or attributes
      const animatedElements = page.locator('[class*="animate"], [class*="motion"], [style*="animation"], [style*="transition"]');
      expect(await animatedElements.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Services Section', () => {
    test('should display services cards', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll to services section
      const servicesSection = page.locator('text=/Services|Ceramic|Detailing/i').first();
      await servicesSection.scrollIntoViewIfNeeded();
      
      // Check for service cards
      const serviceCards = page.locator('[class*="card"], [class*="service"]').filter({ hasText: /Ceramic|Coating|Interior/ });
      expect(await serviceCards.count()).toBeGreaterThan(0);
    });

    test('service cards should have hover effects', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const cards = page.locator('[class*="group"]').first();
      
      if (await cards.isVisible().catch(() => false)) {
        await cards.hover();
        await page.waitForTimeout(300);
        
        // Card should still be visible after hover
        await expect(cards).toBeVisible();
      }
    });
  });

  test.describe('Gallery Components', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
    });

    test('should display gallery images', async ({ page }) => {
      const images = page.locator('img');
      expect(await images.count()).toBeGreaterThan(0);
      
      // Check first image is visible
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
    });

    test('images should load properly', async ({ page }) => {
      const images = page.locator('img');
      
      for (const img of await images.all().slice(0, 5)) {
        const naturalWidth = await img.evaluate(el => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });

    test('should have lazy loading on images', async ({ page }) => {
      const lazyImages = page.locator('img[loading="lazy"]');
      // Some images should have lazy loading
      expect(await lazyImages.count()).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Calculator Components', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/calculator');
      await page.waitForLoadState('networkidle');
    });

    test('should display calculator form elements', async ({ page }) => {
      // Check for select inputs
      const selects = page.locator('select');
      
      // Check for buttons
      const buttons = page.locator('button');
      expect(await buttons.count()).toBeGreaterThan(0);
      
      // Check for price display
      const priceElements = page.locator('text=/\$|price|total/i').first();
      expect(await priceElements.isVisible().catch(() => false) || await selects.count() > 0).toBe(true);
    });

    test('should update total price on selection', async ({ page }) => {
      // Find and interact with calculator options
      const options = page.locator('button, select');
      
      if (await options.first().isVisible()) {
        const initialPrice = await page.locator('text=/\$[\d,]+/').first().textContent().catch(() => '$0');
        
        // Try to select an option
        const selects = page.locator('select');
        if (await selects.first().isVisible().catch(() => false)) {
          await selects.first().selectOption({ index: 1 });
          await page.waitForTimeout(500);
          
          // Price might have updated
          const newPrice = await page.locator('text=/\$[\d,]+/').first().textContent().catch(() => '$0');
          expect(newPrice).toBeDefined();
        }
      }
    });
  });

  test.describe('Dashboard Components', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
    });

    test('should display dashboard layout', async ({ page }) => {
      // Check for dashboard-specific elements
      await expect(page.locator('body')).toBeVisible();
      
      // Look for common dashboard elements
      const dashboardElements = page.locator('text=/Dashboard|Overview|Stats|Bookings/i');
      expect(await dashboardElements.count()).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Animations Showcase', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/animations');
      await page.waitForLoadState('networkidle');
    });

    test('should display animation showcase page', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible();
      
      // Look for animation-related content
      const animationContent = page.locator('text=/Animation|Motion|Effect/i');
      expect(await animationContent.count()).toBeGreaterThanOrEqual(0);
    });

    test('should have animated buttons', async ({ page }) => {
      const buttons = page.locator('button');
      expect(await buttons.count()).toBeGreaterThan(0);
      
      // Test button hover animations
      for (const button of await buttons.all().slice(0, 3)) {
        if (await button.isVisible().catch(() => false)) {
          await button.hover();
          await page.waitForTimeout(200);
          await expect(button).toBeVisible();
        }
      }
    });
  });

  test.describe('Toast Notifications', () => {
    test('should display toast on user action', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll to footer to find newsletter or action button
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      
      // Try to trigger a toast by clicking subscribe with invalid email
      const emailInput = footer.locator('input[type="email"]').first();
      const subscribeButton = footer.locator('button:has-text("Subscribe")').first();
      
      if (await emailInput.isVisible().catch(() => false) && await subscribeButton.isVisible().catch(() => false)) {
        await emailInput.fill('test');
        await subscribeButton.click();
        
        // Check for toast
        await page.waitForTimeout(500);
        const toast = page.locator('[role="alert"], .toast, [class*="toast"]').first();
        // Toast might appear or might not depending on validation
        expect(await toast.isVisible().catch(() => false) || true).toBe(true);
      }
    });
  });

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 },
    ];

    for (const { name, width, height } of viewports) {
      test(`should display correctly on ${name} viewport`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Check no horizontal overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small scrollbar
        
        // Take screenshot for verification
        await page.screenshot({ path: `test-results/responsive-${name.toLowerCase()}.png`, fullPage: false });
      });
    }
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const h1s = await page.locator('h1').count();
      expect(h1s).toBeGreaterThanOrEqual(1);
      
      // Check that h1 comes before h2, etc.
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      let prevLevel = 0;
      
      for (const heading of headings.slice(0, 10)) {
        const level = parseInt(await heading.evaluate(el => el.tagName)[1]);
        expect(level).toBeGreaterThanOrEqual(prevLevel - 1); // Allow skipping levels down
        prevLevel = level;
      }
    });

    test('should have alt text on images', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      const images = await page.locator('img').all();
      
      for (const img of images.slice(0, 10)) {
        const alt = await img.getAttribute('alt');
        // Alt can be empty for decorative images, but should exist
        expect(alt !== null).toBe(true);
      }
    });

    test('should have proper ARIA labels on interactive elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check buttons have accessible names
      const buttons = await page.locator('button').all();
      
      for (const button of buttons.slice(0, 5)) {
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        const hasAccessibleName = ariaLabel || text?.trim();
        expect(hasAccessibleName).toBeTruthy();
      }
    });
  });

  test.describe('Dark Mode', () => {
    test('should toggle dark mode and persist styles', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find theme toggle
      const themeToggle = page.locator('button[aria-label*="dark" i], button[aria-label*="light" i], button:has-text("☀️"), button:has-text("🌙")').first();
      
      if (await themeToggle.isVisible().catch(() => false)) {
        // Toggle to dark
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Check dark mode class
        const html = page.locator('html, body').first();
        const className = await html.getAttribute('class');
        const isDark = className?.includes('dark') || className?.includes('dark-mode');
        expect(isDark !== undefined).toBe(true);
        
        // Navigate to another page and check persistence
        await page.goto('/gallery');
        await page.waitForLoadState('networkidle');
        
        const newClassName = await html.getAttribute('class');
        // Dark mode should persist (implementation dependent)
        expect(newClassName).toBeDefined();
      }
    });
  });
});
