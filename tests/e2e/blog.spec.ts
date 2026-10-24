import { test, expect } from './fixtures'

const articles = [
  { slug: 'from-mockup-to-market', title: 'From Mockup to Market: My End-to-End Product Design Process' },
  { slug: 'psychology-of-color-in-ui-design', title: 'The Psychology of Color in UI Design' },
  { slug: 'how-i-built-my-own-design-system-from-scratch', title: 'How I Built My Design System from Scratch' },
  { slug: 'slow-design-in-fast-paced-digital-world', title: 'The Case for Slow Design in a Fast-Paced Digital World' }
]

test.describe('Blog index', () => {
  test('features the latest article and lists the rest newest first', async ({ page }) => {
    await page.goto('/blog')

    await expect(page.getByTestId('blog-featured')).toContainText('Latest article')
    await expect(page.getByTestId('blog-featured')).toHaveAttribute('href', `/blog/${articles[0]!.slug}`)
    await expect(page.getByTestId('blog-post-title')).toHaveText(articles.map(a => a.title))
    await expect(page.getByTestId('blog-post-card')).toHaveCount(3)
  })

  test('opening an article and going back to the journal', async ({ page }) => {
    await page.goto('/blog')
    await page.getByTestId('blog-post-card').first().click()

    await expect(page).toHaveURL(`/blog/${articles[1]!.slug}`)
    await expect(page).toHaveTitle(`${articles[1]!.title} · Mentora`)
    await expect(page.getByTestId('page-title')).toHaveText(articles[1]!.title)

    await page.getByTestId('article-back').click()
    await expect(page).toHaveURL('/blog')
  })
})

test.describe('Article', () => {
  test('"Copy link" copies the article URL and confirms with a toast', async ({ page, context, browserName, baseURL }) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions are only grantable in Chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    const url = `/blog/${articles[1]!.slug}`
    await page.goto(url)

    await page.getByTestId('article-copy-link').click()

    await expect(page.getByTestId('toast')).toContainText('Article link copied to clipboard')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}${url}`)
  })

  test('previous/next links navigate between articles', async ({ page }) => {
    await page.goto(`/blog/${articles[1]!.slug}`)
    const next = page.getByTestId('article-nav-next')
    const nextHref = await next.getAttribute('href')

    await next.click()

    await expect(page).toHaveURL(nextHref!)
    await expect(page.getByTestId('article-nav-previous')).toHaveAttribute('href', `/blog/${articles[1]!.slug}`)
  })

  test('the newest article has only a "next" link and the oldest only a "previous" link', async ({ page }) => {
    await page.goto(`/blog/${articles[0]!.slug}`)
    await expect(page.getByTestId('article-nav-previous')).toHaveCount(0)
    await expect(page.getByTestId('article-nav-next')).toHaveCount(1)

    await page.goto(`/blog/${articles[3]!.slug}`)
    await expect(page.getByTestId('article-nav-previous')).toHaveCount(1)
    await expect(page.getByTestId('article-nav-next')).toHaveCount(0)
  })

  test('previous/next follow the journal\'s date order', async ({ page }) => {
    for (const [index, article] of articles.entries()) {
      await page.goto(`/blog/${article.slug}`)
      const previous = articles[index - 1]
      const next = articles[index + 1]

      if (previous) {
        await expect(page.getByTestId('article-nav-previous')).toHaveAttribute('href', `/blog/${previous.slug}`)
      }
      if (next) {
        await expect(page.getByTestId('article-nav-next')).toHaveAttribute('href', `/blog/${next.slug}`)
      }
    }
  })

  test('an unknown article shows the 404 page', async ({ page }) => {
    const response = await page.goto('/blog/nope')

    expect(response?.status()).toBe(404)
    await expect(page).toHaveTitle('Page not found')
    await expect(page.getByTestId('error-page')).toContainText('404')
    await expect(page.getByTestId('error-page')).toContainText('Page not found')
  })
})
