import { test, expect } from '@playwright/test';

test('Judge 90-second flow', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CarbonAlpha/);
  await page.click('text=Enter Facility Data');
  await page.waitForURL('**/industrial-intelligence');
  await page.click('text=Steel (Draft)');
  
  // Wait for initial analysis to complete if backend is slow/failing
  // By using the button locator, we avoid issues with text changes during loading
  await page.click('button[type="submit"]');
  
  // Wait for the result to load and the next CTA to appear, then click it to go to /decision
  await page.click('text=EXECUTE FULL DECISION TWIN', { timeout: 10000 });
  await page.waitForURL('**/decision');
  await expect(page.locator('text=DECISION TWIN').first()).toBeVisible();
});
