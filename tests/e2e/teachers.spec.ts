import { test, expect } from './fixtures'

test.describe('Teachers page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teachers')
  })

  test('lists all twenty teachers: a featured spotlight plus a grid of cards', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toHaveText('Find your mentor', { useInnerText: true })
    await expect(page.getByTestId('teachers-count')).toHaveText('20 teachers')

    const spotlight = page.getByTestId('teacher-spotlight')
    await expect(spotlight).toBeVisible()
    await expect(spotlight).toContainText('Featured teacher')
    await expect(spotlight.getByTestId('spotlight-name')).toHaveText('Sofía Herrera')
    await expect(page.getByTestId('teacher-card')).toHaveCount(19)
  })

  test('searching filters teachers by name, subject or bio', async ({ page }) => {
    const search = page.getByTestId('teacher-search')

    await search.fill('piano')
    await expect(page.getByTestId('teachers-count')).toHaveText('1 teacher')
    await expect(page.getByTestId('teacher-spotlight')).toHaveCount(0)
    await expect(page.getByTestId('teacher-name')).toHaveText(['Kenji Watanabe'])

    await search.fill('okafor')
    await expect(page.getByTestId('spotlight-name')).toHaveText('David Okafor')
    await expect(page.getByTestId('teacher-card')).toHaveCount(0)
  })

  test('the subject list filters teachers and marks the selected subject', async ({ page }) => {
    const filters = page.getByTestId('subject-filter')
    await expect(filters).toHaveText([
      'All subjects',
      'Languages',
      'Mathematics',
      'Sciences',
      'Music',
      'Coding & Data',
      'Exams & Writing'
    ])
    await expect(filters.first()).toHaveAttribute('aria-pressed', 'true')

    const music = filters.filter({ hasText: 'Music' })
    await music.click()
    await expect(music).toHaveAttribute('aria-pressed', 'true')
    await expect(filters.first()).toHaveAttribute('aria-pressed', 'false')
    await expect(page).toHaveURL('/teachers?subject=music')

    await expect(page.getByTestId('teachers-count')).toHaveText('3 teachers')
    await expect(page.getByTestId('spotlight-name')).toHaveText('Liam O\'Connor')
    await expect(page.getByTestId('teacher-name')).toHaveText(['Kenji Watanabe', 'Chloé Laurent'])

    await filters.first().click()
    await expect(page).toHaveURL('/teachers')
    await expect(page.getByTestId('teachers-count')).toHaveText('20 teachers')
  })

  test('search and subject combine, and an empty result can be cleared', async ({ page }) => {
    await page.getByTestId('subject-filter').filter({ hasText: 'Sciences' }).click()
    const search = page.getByTestId('teacher-search')

    await search.fill('physics')
    await expect(page.getByTestId('teachers-count')).toHaveText('2 teachers')

    await search.fill('guitar')
    await expect(page.getByTestId('teachers-empty')).toBeVisible()
    await expect(page.getByTestId('teacher-spotlight')).toHaveCount(0)
    await expect(page.getByTestId('teacher-card')).toHaveCount(0)

    await page.getByTestId('teachers-clear').click()
    await expect(search).toHaveValue('')
    await expect(page.getByTestId('subject-filter').first()).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('teachers-count')).toHaveText('20 teachers')
  })
})

test.describe('Teachers page from a shared link', () => {
  test('a subject in the URL preselects that filter', async ({ page }) => {
    await page.goto('/teachers?subject=coding-and-data')

    await expect(page.getByTestId('subject-filter').filter({ hasText: 'Coding & Data' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('teachers-count')).toHaveText('3 teachers')
    await expect(page.getByTestId('spotlight-name')).toHaveText('Priya Nair')
  })
})

test.describe('Getting to the teachers page', () => {
  test('the main navigation links to it', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('nav-desktop').getByTestId('nav-link-teachers').click()

    await expect(page).toHaveURL('/teachers')
    await expect(page.getByTestId('page-title')).toHaveText('Find your mentor', { useInnerText: true })
  })

  test('"Browse all teachers" on the home page opens it', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('teachers-browse-all').click()

    await expect(page).toHaveURL('/teachers')
  })
})
