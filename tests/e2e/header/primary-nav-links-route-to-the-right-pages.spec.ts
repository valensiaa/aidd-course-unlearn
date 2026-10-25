// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures'

test.describe('Header navigation (desktop)', () => {
  test('Primary nav links route to the right pages', async ({ page }) => {
    // 1. Navigate to `/`.
    await page.goto('/')
    await page.evaluate(() => {
      (window as unknown as { spaMarker: boolean }).spaMarker = true
    })
    const nav = page.getByTestId('nav-desktop')

    // 2. Click each nav link in turn: Subjects, Teachers, Events, Blog, About, Home.
    for (const { slug, path, h1 } of [
      { slug: 'subjects', path: '/subjects', h1: 'Find your subject, then find your teacher' },
      { slug: 'teachers', path: '/teachers', h1: 'Find your mentor' },
      { slug: 'events', path: '/events', h1: 'Free events for curious learners' },
      { slug: 'blog', path: '/blog', h1: 'The Mentora Journal' },
      { slug: 'about', path: '/about', h1: 'Learning works best one-on-one' },
      { slug: 'home', path: '/', h1: 'Learn anything, one-on-one with a teacher who gets you' }
    ]) {
      await nav.getByTestId(`nav-link-${slug}`).click()
      await expect(page).toHaveURL(path)
      await expect(page.getByTestId('page-title')).toHaveText(h1, { useInnerText: true })
    }

    // Navigation is client-side: the marker set before the first click survives
    expect(await page.evaluate(() => (window as unknown as { spaMarker?: boolean }).spaMarker)).toBe(true)
  })
})
