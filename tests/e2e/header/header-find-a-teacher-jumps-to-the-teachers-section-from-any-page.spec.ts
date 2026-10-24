// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Header navigation (desktop)', () => {
  test('Header "Find a teacher" jumps to the teachers section from any page', async ({ page }) => {
    // 1. Navigate to `/events`.
    await page.goto('/events')

    // 2. Click "Find a teacher" in the banner.
    await page.getByTestId('header-find-teacher').click()

    await expect(page).toHaveURL('/#teachers')
    await expect(page.getByTestId('teachers-section')).toBeInViewport()
  })
})
