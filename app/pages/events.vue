<script setup lang="ts">
type MentoraEvent = {
  title: string
  description?: string
  date: string
  location: string
  url?: string
  category: 'Webinar' | 'Workshop' | 'Podcast'
}

const { data: page } = await useAsyncData('events', () => {
  return queryCollection('events').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
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

const { global } = useAppConfig()
const [suggestLink] = page.value.links

const CATEGORY_ICONS: Record<MentoraEvent['category'], string> = {
  Webinar: 'i-lucide-monitor-play',
  Workshop: 'i-lucide-users',
  Podcast: 'i-lucide-mic'
}

// Split into upcoming (soonest first) and past (most recent first). "Today" is fixed when the
// page is rendered and reused on the client, so the pre-built page and the browser agree.
const today = useState('events-today', () => new Date().toISOString().slice(0, 10)).value
const upcoming = computed(() => (page.value?.events as MentoraEvent[] ?? [])
  .filter(event => event.date.slice(0, 10) >= today)
  .sort((a, b) => a.date.localeCompare(b.date)))
const past = computed(() => (page.value?.events as MentoraEvent[] ?? [])
  .filter(event => event.date.slice(0, 10) < today)
  .sort((a, b) => b.date.localeCompare(a.date)))

const formatDay = (date: string) => new Date(date).toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' })
const formatMonth = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
const formatFull = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
</script>

<template>
  <UPage v-if="page">
    <PageHero
      eyebrow="Events"
      :title="page.title"
      :description="page.description"
      :highlight="2"
    >
      <template #actions>
        <UButton
          v-if="suggestLink"
          :to="`mailto:${global.email}?subject=Event topic suggestion`"
          :icon="suggestLink.icon"
          trailing-icon="i-lucide-arrow-right"
          size="xl"
          class="bg-gradient-brand btn-glow rounded-full px-8 py-4 text-base font-semibold text-white transition hover:opacity-90"
        >
          {{ suggestLink.label }}
        </UButton>
      </template>
    </PageHero>

    <!-- Upcoming -->
    <section
      v-if="upcoming.length"
      class="relative isolate overflow-x-clip pt-8 pb-16 sm:pb-24"
    >
      <BlobBackdrop
        v-parallax="0.1"
        variant="bloom"
        class="pointer-events-none absolute top-1/3 -right-48 -z-10 size-[30rem] opacity-90 max-lg:hidden"
      />
      <UContainer class="max-w-7xl">
        <SectionHeading title="Coming up next" />
        <ol class="mt-12 flex max-w-4xl flex-col gap-5">
          <Motion
            v-for="(event, index) in upcoming"
            :key="event.title"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.08 * index }"
            :in-view-options="{ once: true }"
          >
            <article class="glass-warm flex flex-col gap-5 rounded-2xl p-6 transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:gap-8 sm:p-7">
              <!-- Date block -->
              <time
                :datetime="event.date.slice(0, 10)"
                class="flex w-20 shrink-0 flex-col items-center rounded-2xl bg-midnight-900/70 py-3 ring-1 ring-mentora-500/30"
              >
                <span class="text-xs font-semibold uppercase tracking-widest text-mentora-400">{{ formatMonth(event.date) }}</span>
                <span class="text-gradient-brand font-heading text-4xl font-bold leading-tight">{{ formatDay(event.date) }}</span>
              </time>

              <div class="flex-1">
                <p class="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-mentora-400">
                  <UIcon
                    :name="CATEGORY_ICONS[event.category]"
                    class="size-4"
                    aria-hidden="true"
                  />
                  {{ event.category }}
                </p>
                <h3 class="mt-1.5 font-heading text-xl font-semibold text-highlighted sm:text-2xl">
                  {{ event.title }}
                </h3>
                <p
                  v-if="event.description"
                  class="mt-2 leading-relaxed text-muted"
                >
                  {{ event.description }}
                </p>
                <p class="mt-3 flex items-center gap-1.5 text-sm text-midnight-300">
                  <UIcon
                    name="i-lucide-map-pin"
                    class="size-4"
                    aria-hidden="true"
                  />
                  {{ event.location }}
                </p>
              </div>

              <UButton
                v-if="event.url"
                :to="event.url"
                target="_blank"
                :label="event.category === 'Podcast' ? 'Listen' : 'Save my seat'"
                trailing-icon="i-lucide-arrow-right"
                class="bg-gradient-brand btn-glow self-start rounded-full text-white transition hover:opacity-90 sm:self-center"
              />
            </article>
          </Motion>
        </ol>
      </UContainer>
    </section>

    <!-- Past -->
    <section
      v-if="past.length"
      class="pt-8 pb-20 sm:pb-28"
    >
      <UContainer class="max-w-7xl">
        <SectionHeading
          title="Catch up on past events"
          description="Recordings and episodes from recent sessions."
          :highlight="2"
        />
        <ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Motion
            v-for="(event, index) in past"
            :key="event.title"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.06 * (index % 3) }"
            :in-view-options="{ once: true }"
            class="flex flex-col gap-2 rounded-2xl bg-elevated/40 p-6 ring-1 ring-default transition hover:ring-mentora-500/40"
          >
            <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-midnight-300">
              <UIcon
                :name="CATEGORY_ICONS[event.category]"
                class="size-4 text-mentora-400"
                aria-hidden="true"
              />
              {{ event.category }}
              <span aria-hidden="true">·</span>
              <time :datetime="event.date.slice(0, 10)">{{ formatFull(event.date) }}</time>
            </p>
            <h3 class="font-heading text-lg font-semibold text-highlighted">
              {{ event.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ event.location }}
            </p>
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
