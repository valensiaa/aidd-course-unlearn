import path from 'node:path'
import { test, expect } from '../fixtures'

// One screenshot per home page section, so a change shows up in the section it touched.
// Update the baselines after an intended visual change with:
//   npx playwright test tests/e2e/visual --update-snapshots
const sections: { name: string, testId: string, mask?: string[] }[] = [
  { name: 'hero', testId: 'hero-section' },
  // Its portrait's blob is picked at random on each page load, so it's masked
  { name: 'how-it-works', testId: 'how-it-works-section', mask: ['blob-backdrop'] },
  { name: 'teachers', testId: 'teachers-section' },
  { name: 'testimonials', testId: 'testimonials-section' },
  { name: 'faq', testId: 'faq-section' },
  { name: 'cta', testId: 'cta-section' }
]

// Reduced motion holds the blobs and parallax still; the site's theme is dark
test.use({ reducedMotion: 'reduce', colorScheme: 'dark' })

test.describe('Home page visual regression', () => {
  // Rendering differs between browser engines, so baselines are kept for Chromium only
  test.skip(({ browserName }) => browserName !== 'chromium', 'Visual baselines are Chromium-only')

  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Sections fade in when scrolled into view (once). Scroll through the page so every
    // entrance animation plays and every lazy image starts loading
    await page.evaluate(async () => {
      const step = window.innerHeight / 2
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForFunction(() => Array.from(document.images).every(img => img.complete))
    await page.evaluate(() => document.fonts.ready)
  })

  for (const { name, testId, mask = [] } of sections) {
    test(`${name} section`, async ({ page }) => {
      const section = page.getByTestId(testId)
      await expect(section).toHaveScreenshot(`${name}.png`, {
        animations: 'disabled',
        mask: mask.map(id => section.getByTestId(id)),
        stylePath: path.join(import.meta.dirname, 'screenshot.css')
      })
    })
  }
})
