import { test, expect } from './fixtures'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Teachers', () => {
  test('lists six teachers', async ({ page }) => {
    const names = page.getByTestId('teacher-name')

    await expect(names).toHaveText([
      'Sofía Herrera',
      'David Okafor',
      'Mei Tanaka',
      'Liam O\'Connor',
      'Priya Nair',
      'Marcus Bennett'
    ])
    await expect(page.getByTestId('teacher-card')).toHaveCount(6)
  })
})

test.describe('FAQ', () => {
  test('a question expands and collapses its answer', async ({ page }) => {
    const panel = page.getByTestId('faq-panel')
    const question = panel.getByTestId('faq-question').first()
    const answer = panel.getByTestId('faq-answer').first()

    await expect(question).toHaveText('How do I find the right teacher?')
    await expect(answer).toBeHidden()

    await question.click()
    await expect(answer).toBeVisible()
    await expect(answer).toContainText('Browse our teachers by subject')

    await question.click()
    await expect(answer).toBeHidden()
  })

  test('category tabs switch the questions', async ({ page }) => {
    const tabs = page.getByTestId('faq-tab')
    const questions = page.getByTestId('faq-panel').getByTestId('faq-question')

    await expect(tabs).toHaveText(['For Students', 'For Teachers', 'Payments & Safety'])
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
    await expect(questions).toHaveText([
      'How do I find the right teacher?',
      'What do I need for a class?',
      'Can I reschedule or cancel a lesson?',
      'How much do lessons cost?'
    ])

    await tabs.nth(1).click()
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false')
    await expect(questions).toHaveText([
      'How do I start teaching on Mentora?',
      'How and when do I get paid?',
      'Do I have to commit to set hours?'
    ])

    await tabs.nth(2).click()
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
    await expect(questions).toHaveText([
      'Is it safe to learn online with a stranger?',
      'What payment methods do you accept?'
    ])
  })

  test('arrow keys move between tabs and wrap around', async ({ page }) => {
    const tabs = page.getByTestId('faq-tab')

    await tabs.nth(0).focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabs.nth(1)).toBeFocused()
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')

    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(tabs.nth(2)).toBeFocused()
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
  })
})
