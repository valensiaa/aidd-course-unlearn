import { test, expect } from './fixtures'

const pages = [
  { path: '/', title: 'Mentora — Learn Anything, One-on-One with Expert Teachers', h1: 'Learn anything, one-on-one with a teacher who gets you' },
  { path: '/subjects', title: 'Find your subject, then find your teacher · Mentora', h1: 'Find your subject, then find your teacher' },
  { path: '/events', title: 'Free events for curious learners · Mentora', h1: 'Free events for curious learners' },
  { path: '/blog', title: 'The Mentora Journal', h1: 'The Mentora Journal' },
  { path: '/about', title: 'Learning works best one-on-one · Mentora', h1: 'Learning works best one-on-one' }
]

test.describe('Page loading', () => {
  for (const { path, title, h1 } of pages) {
    test(`${path} loads with title, heading and shared layout`, async ({ page }) => {
      const response = await page.goto(path)

      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(title)
      await expect(page.getByTestId('page-title')).toHaveCount(1)
      await expect(page.getByTestId('page-title')).toHaveText(h1, { useInnerText: true })

      await expect(page.getByTestId('site-header')).toBeVisible()
      await expect(page.getByTestId('header-find-teacher')).toHaveAttribute('href', '/#teachers')
      await expect(page.getByTestId('site-footer')).toBeVisible()
      await expect(page.getByTestId('footer-link-discord')).toBeVisible()
      await expect(page.getByTestId('footer-link-x')).toBeVisible()
      await expect(page.getByTestId('footer-link-github')).toBeVisible()
      await expect(page.getByTestId('cta-section')).toContainText('Your next breakthrough is one lesson away')
    })
  }
})
