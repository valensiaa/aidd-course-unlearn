// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'
import type { Page } from '@playwright/test'

const htmlTheme = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light')

test.describe('Color mode', () => {
  test('Toggle switches theme and persists across reloads', async ({ page }) => {
    const toggle = page.getByTestId('nav-desktop').getByTestId('color-mode-toggle')

    // 1. Fresh context, navigate to `/`.
    await page.goto('/')

    // 2. Verify `<html>` has class `dark` and the toggle is labelled "Switch to light mode".
    expect(await htmlTheme(page)).toBe('dark')
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode')

    // 3. Click the toggle.
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode')
    await expect.poll(() => htmlTheme(page)).toBe('light')

    // 4. Reload the page.
    await page.reload()
    await expect.poll(() => htmlTheme(page)).toBe('light')

    // 5. Navigate to `/blog`.
    await page.getByTestId('nav-desktop').getByTestId('nav-link-blog').click()
    await expect(page).toHaveURL('/blog')
    await expect.poll(() => htmlTheme(page)).toBe('light')

    // Clicking again returns to `dark`
    await toggle.click()
    await expect.poll(() => htmlTheme(page)).toBe('dark')
  })
})
