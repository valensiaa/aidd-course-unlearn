// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Landing page interactions', () => {
  test('Bottom CTA "Become a teacher" is a mailto link', async ({ page }) => {
    // 1. Navigate to `/`, scroll to "Your next breakthrough is one lesson away".
    await page.goto('/')
    const cta = page.getByTestId('cta-section')
    await cta.scrollIntoViewIfNeeded()
    await expect(cta).toContainText('Your next breakthrough is one lesson away')

    await expect(page.getByTestId('cta-secondary')).toHaveText('Become a teacher')
    await expect(page.getByTestId('cta-secondary')).toHaveAttribute(
      'href',
      'mailto:hello@mentora.com?subject=I want to teach on Mentora'
    )

    // "Find a teacher" points to the teachers section
    await expect(page.getByTestId('cta-primary')).toHaveText('Find a teacher')
    await page.getByTestId('cta-primary').click()
    await expect(page).toHaveURL('/#teachers')
    await expect(page.getByTestId('teachers-section')).toBeInViewport()
  })
})
