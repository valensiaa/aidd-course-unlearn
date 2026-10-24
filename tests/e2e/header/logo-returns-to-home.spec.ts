// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Header navigation (desktop)', () => {
  test('Logo returns to home', async ({ page }) => {
    // 1. Navigate to `/about`.
    await page.goto('/about')

    // 2. Click the "Mentora home" link.
    await page.getByTestId('header-logo').click()

    await expect(page).toHaveURL('/')
    await expect(page.getByTestId('page-title')).toHaveText(
      'Learn anything, one-on-one with a teacher who gets you',
      { useInnerText: true }
    )
  })
})
