// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Landing page interactions', () => {
  test('Bottom CTA "Find a teacher" opens the teachers page', async ({ page }) => {
    // 1. Navigate to `/`, scroll to "Your next breakthrough is one lesson away".
    await page.goto('/')
    const cta = page.getByTestId('cta-section')
    await cta.scrollIntoViewIfNeeded()
    await expect(cta).toContainText('Your next breakthrough is one lesson away')

    // "Find a teacher" is the only action: there's no teacher sign-up yet
    await expect(page.getByTestId('cta-secondary')).toHaveCount(0)
    await expect(page.getByTestId('cta-primary')).toHaveText('Find a teacher')

    // 2. Click "Find a teacher".
    await page.getByTestId('cta-primary').click()
    await expect(page).toHaveURL('/teachers')
    await expect(page.getByTestId('page-title')).toHaveText('Find your mentor', { useInnerText: true })
  })
})
