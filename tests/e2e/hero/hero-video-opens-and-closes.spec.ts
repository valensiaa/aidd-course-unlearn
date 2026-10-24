// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'
import type { Page } from '@playwright/test'

const pageScrollable = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden')

test.describe('Landing page interactions', () => {
  // Close requests are ignored while the opening circle-reveal animation runs; with reduced
  // motion there is no animation, so the player can be closed straight away
  test.use({ reducedMotion: 'reduce' })

  test('Hero video opens and closes', async ({ page }) => {
    const play = page.getByTestId('video-play')
    const dialog = page.getByTestId('video-dialog')

    // 1. Navigate to `/`.
    await page.goto('/')

    // 2. Click "Play video".
    await play.click()
    await expect(dialog).toBeVisible()
    await expect(page.getByTestId('video-close')).toBeVisible()
    expect(await pageScrollable(page)).toBe(false)

    // 3. Close it with the "Close video" button.
    await page.getByTestId('video-close').click()
    await expect(dialog).toHaveCount(0)
    await expect.poll(() => pageScrollable(page)).toBe(true)

    // 4. Reopen it and press `Escape`.
    await play.click()
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect.poll(() => pageScrollable(page)).toBe(true)

    // 5. Reopen it and click the backdrop outside the player.
    await play.click()
    await expect(dialog).toBeVisible()
    await dialog.click({ position: { x: 5, y: 5 } })
    await expect(dialog).toHaveCount(0)
    await expect.poll(() => pageScrollable(page)).toBe(true)

    // Rapid double-click on "Play video" opens only one dialog
    await play.dblclick()
    await expect(dialog).toHaveCount(1)
  })
})
