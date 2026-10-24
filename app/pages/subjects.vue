<script setup lang="ts">
const { data: page } = await useAsyncData('subjects-page', () => {
  return queryCollection('pages').path('/subjects').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: subjects } = await useAsyncData('subjects', () => {
  return queryCollection('subjects').order('order', 'ASC').all()
})

// The home page content holds the shared call-to-action that closes every page
const { data: home } = await useAsyncData('index', () => queryCollection('index').first())

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})

const [primaryLink, secondaryLink] = page.value.links

// Cycle the solid blob variants across the cards; only the hovered card's blob moves
const CARD_BLOBS: BlobVariantName[] = ['ember', 'shard', 'bloom', 'dusk']
const hoveredCard = ref<number>()
</script>

<template>
  <UPage v-if="page">
    <PageHero
      eyebrow="Subjects"
      :title="page.title"
      :description="page.description"
      :highlight="2"
    >
      <template #actions>
        <UButton
          v-if="primaryLink"
          :to="primaryLink.to"
          :icon="primaryLink.icon"
          trailing-icon="i-lucide-arrow-right"
          size="xl"
          class="bg-gradient-brand btn-glow rounded-full px-8 py-4 text-base font-semibold text-white transition hover:opacity-90"
        >
          {{ primaryLink.label }}
        </UButton>
        <UButton
          v-if="secondaryLink"
          :to="secondaryLink.to"
          :icon="secondaryLink.icon"
          color="neutral"
          variant="outline"
          size="xl"
          class="rounded-full bg-transparent px-8 py-4 text-base font-semibold text-highlighted ring-default transition hover:bg-elevated/50 dark:ring-white/25 dark:hover:bg-white/5"
        >
          {{ secondaryLink.label }}
        </UButton>
      </template>
    </PageHero>

    <section class="pt-8 pb-20 sm:pb-28">
      <UContainer class="max-w-7xl">
        <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Motion
            v-for="(subject, index) in subjects"
            :key="subject.title"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.08 * (index % 3) }"
            :in-view-options="{ once: true }"
          >
            <article
              data-testid="subject-card"
              class="group glass-warm flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1"
              @mouseenter="hoveredCard = index"
              @mouseleave="hoveredCard = undefined"
            >
              <!-- Framed photo on a blob, tilted alternately like a scattered stack -->
              <div class="relative isolate flex aspect-[4/3] items-center justify-center">
                <BlobBackdrop
                  :variant="CARD_BLOBS[index % CARD_BLOBS.length]"
                  :paused="hoveredCard !== index"
                  :fast="hoveredCard === index"
                  :outline="false"
                  class="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square h-[88%] -translate-x-1/2 -translate-y-1/2"
                />
                <div
                  class="photo-frame aspect-[4/5] h-[72%] transition duration-300 group-hover:rotate-0"
                  :class="index % 2 === 0 ? '-rotate-3' : 'rotate-3'"
                >
                  <NuxtImg
                    :src="subject.image.src"
                    :alt="subject.image.alt"
                    width="200"
                    height="250"
                    densities="x1 x2"
                    format="webp"
                    loading="lazy"
                    class="size-full object-cover"
                  />
                </div>
              </div>

              <div class="flex flex-1 flex-col gap-4 p-6 pt-2">
                <div class="flex items-center gap-3">
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-mentora-500/10 text-mentora-400 ring-1 ring-mentora-500/40">
                    <UIcon
                      :name="subject.icon"
                      class="size-5"
                      aria-hidden="true"
                    />
                  </span>
                  <h2
                    data-testid="subject-title"
                    class="font-heading text-xl font-semibold text-highlighted"
                  >
                    {{ subject.title }}
                  </h2>
                </div>
                <p class="text-sm leading-relaxed text-muted">
                  {{ subject.description }}
                </p>
                <ul
                  class="flex flex-wrap gap-2"
                  :aria-label="`${subject.title} topics`"
                >
                  <li
                    v-for="topic in subject.topics"
                    :key="topic"
                    data-testid="subject-topic"
                    class="rounded-full px-3 py-1 text-xs font-medium text-muted ring-1 dark:text-midnight-200 ring-default"
                  >
                    {{ topic }}
                  </li>
                </ul>
                <ULink
                  to="/#teachers"
                  data-testid="subject-find-teacher"
                  class="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-mentora-400 hover:text-mentora-300"
                  :aria-label="`Find a ${subject.title.toLowerCase()} teacher`"
                >
                  Find a teacher
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </ULink>
              </div>
            </article>
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
