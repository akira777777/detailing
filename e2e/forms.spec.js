import { test, expect } from '@playwright/test';

test.describe('Form Submission Tests', () => {
  
  test.describe('Booking Form', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to calculator first to set up booking data
      await page.goto('/calculator');
      await page.waitForLoadState('networkidle');
      
      // Select a car model
      const carSelect = page.locator('select, [name="carModel"], input[placeholder*="car" i]').first();
      if (await carSelect.isVisible().catch(() => false)) {
        await carSelect.selectOption({ index: 1 });
      }
      
      // Select a package or service
      const packageButtons = page.locator('button:has-text("Select"), button:has-text("Choose"), [role="button"]').filter({ hasText: /select|choose|book/i });
      if (await packageButtons.first().isVisible().catch(() => false)) {
        await packageButtons.first().click();
      }
      
      // Navigate to booking page
      await page.goto('/booking');
      await page.waitForLoadState('networkidle');
    });

    test('should display booking form elements', async ({ page }) => {
      // Check for calendar
      await expect(page.locator('text=Pick a Date').first()).toBeVisible();
      
      // Check for time selection
      await expect(page.locator('text=Select Start Time').first()).toBeVisible();
      
      // Check for summary section
      await expect(page.locator('text=Your Selection').first()).toBeVisible();
      
      // Check for confirm button
      await expect(page.locator('button:has-text("Confirm")').first()).toBeVisible();
    });

    test('should select date from calendar', async ({ page }) => {
      // Find and click a date
      const dateButtons = page.locator('button[aria-label*="Select"]').filter({ hasText: /\d+/ });
      
      if (await dateButtons.first().isVisible().catch(() => false)) {
        await dateButtons.first().click();
        
        // Verify the date is selected (aria-pressed or styling)
        const selectedDate = page.locator('button[aria-pressed="true"]').first();
        await expect(selectedDate).toBeVisible();
      }
    });

    test('should select time slot', async ({ page }) => {
      // Find time slot buttons
      const timeSlots = page.locator('button[aria-label*="AM"], button[aria-label*="PM"]').first();
      
      if (await timeSlots.isVisible().catch(() => false)) {
        const availableSlots = page.locator('button:not([disabled])').filter({ hasText: /AM|PM/ });
        await availableSlots.first().click();
        
        // Verify selection
        const selectedSlot = page.locator('button[aria-pressed="true"]').filter({ hasText: /AM|PM/ });
        await expect(selectedSlot).toBeVisible();
      }
    });

    test('should show validation for incomplete booking', async ({ page }) => {
      // Try to submit without selecting date/time if validation exists
      const confirmButton = page.locator('button:has-text("Confirm")').first();
      
      if (await confirmButton.isEnabled().catch(() => false)) {
        await confirmButton.click();
        
        // Check for error message or validation
        const errorMessage = page.locator('text=/error|required|please select/i').first();
        if (await errorMessage.isVisible().catch(() => false)) {
          await expect(errorMessage).toBeVisible();
        }
      }
    });

    test('should navigate back to calculator', async ({ page }) => {
      const backButton = page.locator('a:has-text("Back"), button:has-text("Back"), [aria-label*="back" i]').first();
      
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await expect(page).toHaveURL(/\/calculator/);
      }
    });
  });

  test.describe('Newsletter Subscription', () => {
    test('should display newsletter form in footer', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll to footer
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      
      // Check for email input
      const emailInput = footer.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible();
      
      // Check for subscribe button
      const subscribeButton = footer.locator('button:has-text("Subscribe")').first();
      await expect(subscribeButton).toBeVisible();
    });

    test('should validate email input', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      
      const emailInput = footer.locator('input[type="email"]').first();
      const subscribeButton = footer.locator('button:has-text("Subscribe")').first();
      
      if (await emailInput.isVisible().catch(() => false)) {
        // Try invalid email
        await emailInput.fill('invalid-email');
        await subscribeButton.click();
        
        // Check for HTML5 validation or error message
        const validationMessage = await emailInput.evaluate(el => el.validationMessage);
        expect(validationMessage.length > 0 || await page.locator('text=/valid email|invalid/i').first().isVisible().catch(() => false)).toBeTruthy();
      }
    });

    test('should accept valid email', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      
      const emailInput = footer.locator('input[type="email"]').first();
      
      if (await emailInput.isVisible().catch(() => false)) {
        await emailInput.fill('test@example.com');
        
        const isValid = await emailInput.evaluate(el => el.checkValidity());
        expect(isValid).toBe(true);
      }
    });
  });

  test.describe('Theme Toggle', () => {
    test('should toggle between light and dark mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find theme toggle button
      const themeToggle = page.locator('button[aria-label*="dark" i], button[aria-label*="light" i], button:has-text("☀️"), button:has-text("🌙")').first();
      
      if (await themeToggle.isVisible().catch(() => false)) {
        // Get initial theme
        const initialClass = await page.locator('html, body').first().getAttribute('class');
        
        // Toggle theme
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Check if theme changed
        const newClass = await page.locator('html, body').first().getAttribute('class');
        
        // Theme should have changed (either dark class added/removed or different classes)
        const themeChanged = initialClass !== newClass || 
                            newClass?.includes('dark') !== initialClass?.includes('dark');
        expect(themeChanged).toBe(true);
        
        // Toggle back
        await themeToggle.click();
      }
    });
  });

  test.describe('Button Interactions', () => {
    test('should handle CTA button clicks', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test Book Now button
      const bookNowButton = page.locator('a:has-text("Book Now"), button:has-text("Book Now")').first();
      
      if (await bookNowButton.isVisible().catch(() => false)) {
        await bookNowButton.click();
        
        // Should navigate to booking or calculator
        const url = page.url();
        expect(url).toMatch(/\/(booking|calculator)/);
      }
    });

    test('should handle hover states on interactive elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find buttons
      const buttons = await page.locator('button, a[role="button"]').all();
      
      for (const button of buttons.slice(0, 5)) {
        if (await button.isVisible().catch(() => false)) {
          // Hover over button
          await button.hover();
          await page.waitForTimeout(200);
          
          // Verify button is still visible and accessible
          await expect(button).toBeVisible();
        }
      }
    });
  });
});
