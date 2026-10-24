// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Error handling', () => {
  test('Bottom-CTA "Find a teacher" works from inner pages', async ({ page }) => {
    for (const path of ['/events', '/subjects', '/about', '/blog']) {
      // 1. Navigate to `/events` (repeat for `/subjects`, `/about`, `/blog`).
      await page.goto(path)

      // 2. In the bottom CTA ("Your next breakthrough is one lesson away"), click "Find a teacher".
      await page.getByTestId('cta-primary').click()

      await expect(page).toHaveURL('/#teachers')
      await expect(page.getByTestId('teachers-section')).toBeInViewport()
    }
  })
})
