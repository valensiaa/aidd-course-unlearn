// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('Mobile menu can be dismissed without navigating', async ({ page }) => {
    const openButton = page.getByTestId('mobile-menu-open')
    const menu = page.getByTestId('mobile-menu')

    // 1. At 375×812 on `/`, open the menu.
    await page.goto('/')
    await openButton.click()
    await expect(menu).toBeVisible()

    // 2. Click "Close". Reopen it and press `Escape`.
    await page.getByTestId('mobile-menu-close').click()
    await expect(menu).toBeHidden()

    await openButton.click()
    await expect(menu).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()

    await expect(openButton).toBeFocused()
    await expect(page).toHaveURL('/')
  })
})
