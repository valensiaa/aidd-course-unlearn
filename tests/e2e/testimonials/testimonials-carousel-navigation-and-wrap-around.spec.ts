// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Landing page interactions', () => {
  test('Testimonials carousel navigation and wrap-around', async ({ page }) => {
    const status = page.getByTestId('testimonials-status')
    const slides = page.getByTestId('testimonial-slide')

    // 1. Navigate to `/`, locate region "Testimonials".
    await page.goto('/')
    await page.getByTestId('testimonials-carousel').scrollIntoViewIfNeeded()
    await expect(slides).toHaveCount(7)

    // 2. Note the active slide label ("1 of 7").
    await expect(status).toContainText('Testimonial 1 of 7')
    await expect(slides.nth(0)).toHaveAttribute('aria-hidden', 'false')

    // 3. Click "Next testimonial".
    await page.getByTestId('testimonials-next').click()
    await expect(status).toContainText('Testimonial 2 of 7')
    await expect(slides.nth(1)).toHaveAttribute('aria-hidden', 'false')
    await expect(slides.nth(0)).toHaveAttribute('aria-hidden', 'true')

    // 4. Click "Previous testimonial" twice.
    await page.getByTestId('testimonials-prev').click()
    await page.getByTestId('testimonials-prev').click()
    await expect(status).toContainText('Testimonial 7 of 7')
    await expect(slides.nth(6)).toHaveAttribute('aria-hidden', 'false')

    // Clicking "Next" from "7 of 7" wraps to "1 of 7"
    await page.getByTestId('testimonials-next').click()
    await expect(status).toContainText('Testimonial 1 of 7')
    await expect(slides.nth(0)).toHaveAttribute('aria-hidden', 'false')
  })
})
