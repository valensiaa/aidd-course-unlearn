<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#121619' : 'white')

// The site may be served from a subpath (GitHub Pages), so public files need the base URL
const { baseURL } = useRuntimeConfig().app

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: `${baseURL}favicon.ico` }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// Link preview (LinkedIn, X, Slack…) for every page: the home page hero at 1200×630.
// Blog articles set their own. Crawlers need the full URL
const ogImage = withSiteUrl('/og-image.jpg', { withBase: true }).value
const ogImageAlt = 'Mentora: learn anything, one-on-one with a teacher who gets you'

useSeoMeta({
  // Brand suffix, unless the page title already names Mentora (like the home page's)
  titleTemplate: title => !title || title.includes('Mentora') ? (title || 'Mentora') : `${title} · Mentora`,
  ogImage: { url: ogImage, width: 1200, height: 630, type: 'image/jpeg', alt: ogImageAlt },
  twitterImage: { url: ogImage, alt: ogImageAlt },
  twitterCard: 'summary_large_image'
})

const [{ data: navigation }, { data: files }] = await Promise.all([
  useAsyncData('navigation', () => {
    return Promise.all([
      queryCollectionNavigation('blog')
    ])
  }, {
    transform: data => data.flat()
  }),
  useLazyAsyncData('search', () => {
    return Promise.all([
      queryCollectionSearchSections('blog')
    ])
  }, {
    server: false,
    transform: data => data.flat()
  })
])
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        shortcut="meta_k"
        :links="navLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
