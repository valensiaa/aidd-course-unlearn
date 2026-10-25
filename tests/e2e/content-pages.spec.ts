import { test, expect } from './fixtures'

test.describe('Subjects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/subjects')
  })

  test('lists six subjects, each with four topics and a teacher link', async ({ page }) => {
    await expect(page.getByTestId('subject-title')).toHaveText([
      'Languages',
      'Mathematics',
      'Sciences',
      'Music',
      'Coding & Data',
      'Exams & Writing'
    ])

    const cards = page.getByTestId('subject-card')
    await expect(cards).toHaveCount(6)
    for (const card of await cards.all()) {
      await expect(card.getByTestId('subject-topic')).toHaveCount(4)
      await expect(card.getByTestId('subject-find-teacher')).toHaveAttribute('href', '/#teachers')
    }

    const music = cards.nth(3)
    await expect(music.getByTestId('subject-title')).toHaveText('Music')
    await expect(music.getByTestId('subject-topic')).toHaveText(['Guitar', 'Piano', 'Music theory', 'Songwriting'])
  })

  test('a subject\'s "Find a teacher" link opens the teachers section', async ({ page }) => {
    await page.getByTestId('subject-find-teacher').nth(3).click()

    await expect(page).toHaveURL('/#teachers')
    await expect(page.getByTestId('teachers-section')).toBeInViewport()
  })
})

test.describe('Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/events')
  })

  const datesOf = (items: import('@playwright/test').Locator) =>
    items.evaluateAll(els => els.map(el => el.querySelector('[data-testid="event-date"]')!.getAttribute('datetime')!))

  test('upcoming events are in the future, soonest first', async ({ page }) => {
    const today = new Date().toISOString().slice(0, 10)
    const upcoming = page.getByTestId('upcoming-event')

    await expect(upcoming.first()).toBeVisible()
    const dates = await datesOf(upcoming)
    expect(dates.every(date => date >= today)).toBe(true)
    expect(dates).toEqual([...dates].sort())

    for (const event of await upcoming.all()) {
      await expect(event.getByTestId('event-title')).not.toBeEmpty()
    }
  })

  test('past events are in the past, most recent first', async ({ page }) => {
    const today = new Date().toISOString().slice(0, 10)
    const past = page.getByTestId('past-event')

    await expect(past.first()).toBeVisible()
    const dates = await datesOf(past)
    expect(dates.every(date => date < today)).toBe(true)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  test('all nine events are shown across the two lists', async ({ page }) => {
    await expect(page.getByTestId('event-title')).toHaveCount(9)
  })
})

test.describe('About', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
  })

  test('shows the four values', async ({ page }) => {
    const values = page.getByTestId('about-value')

    await expect(values).toHaveCount(4)
    await expect(values.nth(0)).toContainText('Every teacher is vetted')
    await expect(values.nth(1)).toContainText('Built around your life')
    await expect(values.nth(2)).toContainText('No subscriptions')
    await expect(values.nth(3)).toContainText('Safe and secure')
  })

  test('"Browse subjects" opens the subjects page', async ({ page }) => {
    await page.getByTestId('about-browse-subjects').click()

    await expect(page).toHaveURL('/subjects')
    await expect(page.getByTestId('page-title')).toHaveText('Find your subject, then find your teacher')
  })
})
