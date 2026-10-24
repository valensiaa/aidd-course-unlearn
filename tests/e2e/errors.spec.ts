import { test, expect } from './fixtures'

test.describe('Not found page', () => {
  test('shows the error inside the site layout and links back home', async ({ page }) => {
    const response = await page.goto('/does-not-exist')

    expect(response?.status()).toBe(404)
    await expect(page.getByTestId('error-page')).toContainText('404')
    await expect(page.getByTestId('error-page')).toContainText('Page not found')
    await expect(page.getByTestId('site-header')).toBeVisible()
    await expect(page.getByTestId('site-footer')).toBeVisible()

    await page.getByTestId('error-back-home').click()

    await expect(page).toHaveURL('/')
    await expect(page).toHaveTitle('Mentora — Learn Anything, One-on-One with Expert Teachers')
  })
})
