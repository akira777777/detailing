import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to all main pages from homepage', async ({ page }) => {
    const pages = [
      { name: 'Home', path: '/', selector: 'text=The Art of' },
      { name: 'Gallery', path: '/gallery', selector: 'text=Gallery' },
      { name: 'Calculator', path: '/calculator', selector: 'text=Calculator' },
      { name: 'Booking', path: '/booking', selector: 'text=Schedule' },
      { name: 'Dashboard', path: '/dashboard', selector: 'text=Dashboard' },
      { name: 'Animations', path: '/animations', selector: 'text=Animation' },
    ];

    for (const { name, path, selector } of pages) {
      // Navigate using navbar
      const navLink = page.locator('nav').getByRole('link', { name, exact: false }).first();
      
      if (await navLink.isVisible().catch(() => false)) {
        await navLink.click();
        await expect(page).toHaveURL(new RegExp(`${path}$`));
        
        // Verify page loaded by checking for unique content
        const pageContent = page.locator(selector).first();
        await expect(pageContent).toBeVisible({ timeout: 5000 });
        
        // Take screenshot for verification
        await page.screenshot({ path: `test-results/navigation-${name.toLowerCase()}.png`, fullPage: false });
      }
    }
  });

  test('should navigate using footer links', async ({ page }) => {
    const footerLinks = ['Company', 'Services', 'Newsletter'];
    
    for (const linkText of footerLinks) {
      const footerSection = page.locator('footer');
      await expect(footerSection).toBeVisible();
      
      const section = footerSection.getByText(linkText, { exact: false }).first();
      await expect(section).toBeVisible();
    }
  });

  test('should handle mobile menu navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuButton = page.locator('button[aria-label="Open menu"], button:has-text("menu")').first();
    
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();
      
      // Check if mobile menu opens
      const mobileNav = page.locator('[aria-label="Mobile navigation"]').first();
      await expect(mobileNav).toBeVisible({ timeout: 3000 });
      
      // Navigate via mobile menu
      const galleryLink = mobileNav.getByRole('link', { name: 'Gallery' });
      await galleryLink.click();
      await expect(page).toHaveURL(/\/gallery$/);
    }
  });

  test('should navigate back using browser back button', async ({ page }) => {
    // Go to gallery
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    
    // Go to calculator
    await page.goto('/calculator');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/gallery$/);
    
    // Go back again
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });

  test('should verify all internal links are valid', async ({ page }) => {
    const links = await page.locator('a[href^="/"]').all();
    const hrefs = new Set();
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('//')) {
        hrefs.add(href);
      }
    }
    
    // Verify each unique link returns 200
    for (const href of hrefs) {
      const response = await page.goto(`http://localhost:4173${href}`);
      expect(response?.status()).toBe(200);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    }
  });
});

test.describe('Page Load Performance', () => {
  test('home page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // Should load in less than 5 seconds
    
    // Check for critical content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('all pages should have proper title', async ({ page }) => {
    const pages = [
      { path: '/', title: /Luxe/ },
      { path: '/gallery', title: /Gallery/i },
      { path: '/calculator', title: /Calculator/i },
      { path: '/booking', title: /Booking/i },
      { path: '/dashboard', title: /Dashboard/i },
      { path: '/animations', title: /Animation/i },
    ];

    for (const { path, title } of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveTitle(title);
    }
  });
});
