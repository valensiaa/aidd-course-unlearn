<script setup lang="ts">
const { data: page } = await useAsyncData('blog-page', () => {
  return queryCollection('pages').path('/blog').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}
const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'blogs posts not found',
    fatal: true
  })
}

// The home page content holds the shared call-to-action that closes every page
const { data: home } = await useAsyncData('index', () => queryCollection('index').first())

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})

// The newest article is featured; the rest fill the grid
const featured = computed(() => posts.value?.[0])
const others = computed(() => posts.value?.slice(1) ?? [])

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
</script>

<template>
  <UPage v-if="page">
    <PageHero
      eyebrow="Journal"
      :title="page.title"
      :description="page.description"
    />

    <section class="relative isolate overflow-x-clip pt-8 pb-20 sm:pb-28">
      <UContainer class="max-w-7xl">
        <!-- Featured article -->
        <Motion
          v-if="featured"
          :initial="{ y: 24, opacity: 0 }"
          :while-in-view="{ y: 0, opacity: 1 }"
          :transition="{ duration: 0.6 }"
          :in-view-options="{ once: true }"
        >
          <NuxtLink
            :to="featured.path"
            data-testid="blog-featured"
            class="group glass-warm grid overflow-hidden rounded-3xl transition hover:-translate-y-1 md:grid-cols-2"
          >
            <div class="overflow-hidden">
              <NuxtImg
                :src="featured.image"
                alt=""
                width="640"
                height="420"
                class="aspect-[16/10] size-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div class="flex flex-col justify-center gap-4 p-7 sm:p-10">
              <p class="text-xs font-semibold uppercase tracking-widest text-mentora-400">
                Latest article · {{ formatDate(featured.date) }} · {{ featured.minRead }} min read
              </p>
              <h2
                data-testid="blog-post-title"
                class="font-heading text-2xl font-bold leading-tight text-highlighted sm:text-3xl"
              >
                {{ featured.title }}
              </h2>
              <p class="leading-relaxed text-muted">
                {{ featured.description }}
              </p>
              <div class="mt-2 flex items-center justify-between gap-4">
                <UUser
                  v-bind="featured.author"
                  size="md"
                />
                <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-mentora-400">
                  Read article
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
          </NuxtLink>
        </Motion>

        <!-- Other articles -->
        <ul
          v-if="others.length"
          class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Motion
            v-for="(post, index) in others"
            :key="post.path"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.08 * (index % 3) }"
            :in-view-options="{ once: true }"
          >
            <NuxtLink
              :to="post.path"
              data-testid="blog-post-card"
              class="group glass-warm flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1"
            >
              <div class="overflow-hidden">
                <NuxtImg
                  :src="post.image"
                  alt=""
                  width="420"
                  height="236"
                  loading="lazy"
                  class="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div class="flex flex-1 flex-col gap-3 p-6">
                <p class="text-xs font-semibold uppercase tracking-widest text-mentora-400">
                  {{ formatDate(post.date) }} · {{ post.minRead }} min read
                </p>
                <h2
                  data-testid="blog-post-title"
                  class="font-heading text-xl font-semibold leading-snug text-highlighted"
                >
                  {{ post.title }}
                </h2>
                <p class="line-clamp-3 text-sm leading-relaxed text-muted">
                  {{ post.description }}
                </p>
                <span class="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-mentora-400">
                  Read article
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </NuxtLink>
          </Motion>
        </ul>
      </UContainer>
    </section>

    <LandingCTA
      v-if="home"
      :page="home"
    />
  </UPage>
</template>
