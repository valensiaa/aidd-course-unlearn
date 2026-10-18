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
    fields: ['description', 'image', 'date', 'minRead']
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

// Surround items carry the extra fields requested above, which their type doesn't declare
type Neighbour = ContentNavigationItem & { description?: string, image?: string, date?: string, minRead?: number }

// Previous article on the left, next on the right; either may be missing at the ends
const neighbours = computed(() => {
  const [previous, next] = (surround.value ?? []) as (Neighbour | null)[]
  return [
    previous && { ...previous, label: 'Previous article', icon: 'i-lucide-arrow-left', side: 'left' as const },
    next && { ...next, label: 'Next article', icon: 'i-lucide-arrow-right', side: 'right' as const }
  ].filter(item => !!item)
})

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
          <!-- Author, with their avatar on a small blob that peeks out around it -->
          <div class="mt-1 flex items-center gap-4">
            <div class="relative isolate grid size-16 shrink-0 place-items-center">
              <BlobBackdrop
                variant="ember"
                :outline="false"
                class="pointer-events-none absolute inset-0 -z-10"
              />
              <UAvatar
                :src="page.author.avatar?.src"
                :alt="page.author.avatar?.alt || page.author.name"
                size="xl"
              />
            </div>
            <div class="text-left">
              <p class="font-heading font-semibold text-highlighted">
                {{ page.author.name }}
              </p>
              <p
                v-if="page.author.description"
                class="text-sm text-muted"
              >
                {{ page.author.description }}
              </p>
            </div>
          </div>
        </header>

        <!-- Cover image -->
        <div class="mt-12">
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
          <!-- Previous / next articles as cards, like the journal's article cards -->
          <nav
            v-if="neighbours.length"
            aria-label="More articles"
            class="grid gap-6 sm:grid-cols-2"
          >
            <NuxtLink
              v-for="item in neighbours"
              :key="item.path"
              :to="item.path"
              class="group glass-warm flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1"
              :class="item.side === 'right' ? 'sm:col-start-2 sm:text-right' : ''"
            >
              <div class="overflow-hidden">
                <NuxtImg
                  v-if="item.image"
                  :src="item.image"
                  alt=""
                  width="420"
                  height="236"
                  loading="lazy"
                  class="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div class="flex flex-1 flex-col gap-2 p-6">
                <p
                  class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-mentora-400"
                  :class="item.side === 'right' ? 'sm:justify-end' : ''"
                >
                  <UIcon
                    v-if="item.side === 'left'"
                    :name="item.icon"
                    class="size-4 transition-transform group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  {{ item.label }}
                  <UIcon
                    v-if="item.side === 'right'"
                    :name="item.icon"
                    class="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </p>
                <h2 class="font-heading text-xl font-semibold leading-snug text-highlighted">
                  {{ item.title }}
                </h2>
                <p class="line-clamp-2 text-sm leading-relaxed text-muted">
                  {{ item.description }}
                </p>
                <p
                  v-if="item.date"
                  class="mt-auto pt-2 text-xs text-muted dark:text-midnight-300"
                >
                  {{ formatDate(item.date) }}<template v-if="item.minRead">
                    · {{ item.minRead }} min read
                  </template>
                </p>
              </div>
            </NuxtLink>
          </nav>
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
