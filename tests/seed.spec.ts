import { test, expect } from './e2e/fixtures'

// Starting point for the Playwright test agents: the home page, hydrated
test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('site-header')).toBeVisible()
  })
})
