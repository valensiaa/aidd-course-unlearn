// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('Mobile menu opens, navigates and closes', async ({ page }) => {
    // 1. Set viewport to 375×812 and navigate to `/`.
    await page.goto('/')
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    expect(overflows).toBe(false)

    // 2. Verify the desktop nav links are not visible and an "Open menu" button is.
    await expect(page.getByTestId('nav-desktop')).toBeHidden()
    await expect(page.getByTestId('header-find-teacher')).toBeHidden()
    await expect(page.getByTestId('mobile-menu-open')).toBeVisible()

    // 3. Click "Open menu".
    await page.getByTestId('mobile-menu-open').click()
    const menu = page.getByTestId('mobile-menu')
    await expect(menu).toBeVisible()
    for (const slug of ['home', 'subjects', 'events', 'blog', 'about']) {
      await expect(menu.getByTestId(`nav-link-${slug}`)).toBeVisible()
    }
    await expect(menu.getByTestId('color-mode-toggle')).toBeVisible()
    await expect(page.getByTestId('mobile-menu-find-teacher')).toHaveAttribute('href', '/teachers')

    // 4. Click "Events" inside the "Menu" dialog.
    await menu.getByTestId('nav-link-events').click()

    await expect(page).toHaveURL('/events')
    await expect(menu).toBeHidden()
  })
})
