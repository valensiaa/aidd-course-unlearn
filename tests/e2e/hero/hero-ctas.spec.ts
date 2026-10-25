// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Landing page interactions', () => {
  test('Hero CTAs', async ({ page }) => {
    // 1. Navigate to `/`.
    await page.goto('/')

    // 2. Click hero "Find a teacher". Then scroll to top and click hero "Become a teacher".
    await page.getByTestId('hero-primary-cta').click()
    await expect(page).toHaveURL('/#teachers')
    await expect(page.getByTestId('teachers-section')).toBeInViewport()

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.getByTestId('hero-secondary-cta').click()
    await expect(page).toHaveURL('/#cta')
    await expect(page.getByTestId('cta-section')).toBeInViewport()
    await expect(page.getByTestId('cta-section')).toContainText('Your next breakthrough is one lesson away')

    // 3. Click the avatars link "… 12,000+ passionate, vetted teachers".
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.getByTestId('hero-teachers-badge').click()
    await expect(page).toHaveURL('/teachers')
    await expect(page.getByTestId('page-title')).toHaveText('Find your mentor', { useInnerText: true })
  })
})
