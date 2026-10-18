<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'
import { findPageBreadcrumb } from '@nuxt/content/utils'

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description']
  })
)

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))
const blogNavigation = computed(() => navigation.value.find(item => item.path === '/blog')?.children || [])

const breadcrumb = computed(() => mapContentNavigation(findPageBreadcrumb(blogNavigation?.value, page.value?.path)).map(({ icon, ...link }) => link))

if (page.value.image) {
  defineOgImage({ url: page.value.image })
} else {
  defineOgImageComponent('Blog', {
    headline: breadcrumb.value.map(item => item.label).join(' > ')
  }, {
    fonts: ['Geist:400', 'Geist:600']
  })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title
})

const articleLink = computed(() => `${window?.location}`)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <UMain class="relative isolate overflow-x-clip px-2 pt-28 sm:pt-32">
    <!-- Corner blob, like the other page headers -->
    <BlobBackdrop
      v-parallax="0.15"
      variant="dusk"
      :outline="false"
      class="pointer-events-none absolute -top-40 -right-40 -z-10 size-[26rem] opacity-80 sm:-top-48 sm:-right-48 sm:size-[32rem]"
    />

    <UContainer class="relative min-h-screen max-w-5xl">
      <UPage v-if="page">
        <ULink
          to="/blog"
          class="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-highlighted"
        >
          <UIcon
            name="i-lucide-chevron-left"
            aria-hidden="true"
          />
          The Mentora Journal
        </ULink>

        <header class="mt-8 flex flex-col items-center gap-5 text-center">
          <p class="text-xs font-semibold uppercase tracking-widest text-mentora-400">
            <time
              v-if="page.date"
              :datetime="String(page.date).slice(0, 10)"
            >{{ formatDate(page.date) }}</time>
            <span v-if="page.date && page.minRead"> · </span>
            <span v-if="page.minRead">{{ page.minRead }} min read</span>
          </p>
          <h1 class="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-highlighted sm:text-5xl">
            {{ page.title }}
          </h1>
          <p class="max-w-2xl text-lg leading-relaxed text-muted">
            {{ page.description }}
          </p>
          <UUser
            v-bind="page.author"
            size="lg"
            class="mt-1"
          />
        </header>

        <!-- Cover image framed on a blob that overlaps its edges -->
        <div class="relative isolate mt-12">
          <BlobBackdrop
            v-parallax="0.1"
            variant="ember"
            class="pointer-events-none absolute top-1/2 -left-24 -z-10 size-[30rem] -translate-y-1/2 max-lg:hidden"
          />
          <div class="photo-frame">
            <NuxtImg
              :src="page.image"
              :alt="page.title"
              class="aspect-[21/9] w-full object-cover object-center"
            />
          </div>
        </div>

        <UPageBody class="mx-auto max-w-3xl">
          <ContentRenderer
            v-if="page.body"
            :value="page"
          />

          <div class="flex items-center justify-end gap-2 text-sm text-muted">
            <UButton
              size="sm"
              variant="outline"
              color="neutral"
              icon="i-lucide-link"
              label="Copy link"
              class="rounded-full"
              @click="copyToClipboard(articleLink, 'Article link copied to clipboard')"
            />
          </div>
          <UContentSurround :surround />
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
