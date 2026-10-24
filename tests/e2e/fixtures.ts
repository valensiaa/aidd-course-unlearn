import { test as base, type Page } from '@playwright/test'

declare global {
  interface Window {
    useNuxtApp?: () => { isHydrating?: boolean }
  }
}

// Server-rendered markup is visible before Vue attaches its event handlers, so clicks made
// too early do nothing. Wait for Nuxt to finish hydrating after every full page load.
async function waitForHydration(page: Page) {
  await page.waitForFunction(() => window.useNuxtApp?.().isHydrating === false)
}

export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page)
    const reload = page.reload.bind(page)

    page.goto = async (...args) => {
      const response = await goto(...args)
      await waitForHydration(page)
      return response
    }
    page.reload = async (...args) => {
      const response = await reload(...args)
      await waitForHydration(page)
      return response
    }

    await use(page)
  }
})

export { expect } from '@playwright/test'
