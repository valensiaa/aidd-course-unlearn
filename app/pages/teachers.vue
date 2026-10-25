<script setup lang="ts">
const { data: page } = await useAsyncData('teachers-page', () => {
  return queryCollection('pages').path('/teachers').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

// Teachers live in the home page content; it also holds the shared call-to-action
const { data: home } = await useAsyncData('index', () => queryCollection('index').first())

const { data: subjects } = await useAsyncData('subjects', () => {
  return queryCollection('subjects').order('order', 'ASC').all()
})

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})

// A teacher's `subjects` hold subject file names (`content/subjects/music.yml` → `music`)
const subjectFilters = computed(() => (subjects.value ?? []).map(subject => ({
  slug: subject.stem.split('/').pop()!,
  title: subject.title,
  icon: subject.icon
})))

// Filters live in the URL, so a filtered list can be shared or bookmarked
const route = useRoute()
const router = useRouter()
const queryString = (value: unknown) => typeof value === 'string' ? value : ''

const search = ref(queryString(route.query.q))
const selectedSubject = ref(queryString(route.query.subject))

watch([search, selectedSubject], ([q, subject]) => {
  const query = { q: q.trim(), subject }
  router.replace({
    query: Object.fromEntries(Object.entries(query).filter(([, value]) => value))
  })
})

// Follow the URL too, e.g. when the "Teachers" nav link is clicked on a filtered list
watch(() => route.query, (query) => {
  if (queryString(query.q) !== search.value.trim()) search.value = queryString(query.q)
  selectedSubject.value = queryString(query.subject)
})

function clearFilters() {
  search.value = ''
  selectedSubject.value = ''
}

// Case- and accent-insensitive, so "sofia" finds "Sofía"
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const results = computed(() => {
  const terms = normalize(search.value).split(/\s+/).filter(Boolean)
  return (home.value?.teachers.items ?? []).filter((teacher) => {
    if (selectedSubject.value && !teacher.subjects.includes(selectedSubject.value)) {
      return false
    }
    const haystack = normalize(`${teacher.name} ${teacher.subject} ${teacher.bio}`)
    return terms.every(term => haystack.includes(term))
  })
})

// The first featured teacher among the results gets the spotlight; the rest fill the grid
const spotlight = computed(() => results.value.find(teacher => teacher.featured))
const gridTeachers = computed(() => results.value.filter(teacher => teacher !== spotlight.value))

// Cycle the solid blob variants across the cards (the open `halo` doesn't suit a photo)
const CARD_BLOBS: BlobVariantName[] = ['ember', 'shard', 'bloom', 'dusk']
</script>

<template>
  <UPage v-if="page">
    <PageHero
      eyebrow="Teachers"
      :title="page.title"
      :description="page.description"
    />

    <section class="pt-4 pb-20 sm:pb-28">
      <UContainer class="max-w-7xl grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
        <!-- Filters: search, then the subject list. A sidebar on large screens -->
        <aside
          aria-label="Filter teachers"
          class="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start"
        >
          <div>
            <label
              for="teacher-search"
              class="mb-3 block font-heading text-lg font-semibold text-highlighted"
            >
              Search
            </label>
            <UInput
              id="teacher-search"
              v-model="search"
              data-testid="teacher-search"
              type="search"
              icon="i-lucide-search"
              placeholder="Name, subject or topic"
              size="lg"
              class="w-full"
              :ui="{ base: 'rounded-full' }"
            />
          </div>

          <div>
            <h2 class="mb-3 font-heading text-lg font-semibold text-highlighted">
              Subjects
            </h2>
            <ul class="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              <li
                v-for="filter in [{ slug: '', title: 'All subjects', icon: 'i-lucide-layout-grid' }, ...subjectFilters]"
                :key="filter.slug"
              >
                <button
                  type="button"
                  data-testid="subject-filter"
                  :aria-pressed="selectedSubject === filter.slug"
                  class="flex w-full items-center gap-2.5 rounded-full px-4 py-2 text-left text-sm font-medium ring-1 transition"
                  :class="selectedSubject === filter.slug
                    ? 'bg-mentora-500/10 text-highlighted ring-mentora-500/60'
                    : 'text-muted ring-default hover:bg-elevated/50 hover:text-highlighted lg:ring-transparent'"
                  @click="selectedSubject = filter.slug"
                >
                  <UIcon
                    :name="filter.icon"
                    class="size-4 shrink-0"
                    :class="selectedSubject === filter.slug ? 'text-mentora-400' : ''"
                    aria-hidden="true"
                  />
                  {{ filter.title }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <div class="flex min-w-0 flex-col gap-6">
          <h2 class="sr-only">
            Teachers
          </h2>
          <p
            data-testid="teachers-count"
            aria-live="polite"
            class="text-sm font-medium text-muted"
          >
            {{ results.length }} {{ results.length === 1 ? 'teacher' : 'teachers' }}
          </p>

          <TeacherSpotlight
            v-if="spotlight"
            :key="spotlight.name"
            :teacher="spotlight"
            blob="ember"
          />

          <ul
            v-if="gridTeachers.length"
            class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            <Motion
              v-for="(teacher, index) in gridTeachers"
              :key="teacher.name"
              as="li"
              :initial="{ opacity: 0, transform: 'translateY(20px)' }"
              :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
              :transition="{ delay: 0.08 * (index % 3) }"
              :in-view-options="{ once: true }"
            >
              <TeacherCard
                :teacher="teacher"
                :blob="CARD_BLOBS[(index + 1) % CARD_BLOBS.length]"
              />
            </Motion>
          </ul>

          <div
            v-if="!results.length"
            data-testid="teachers-empty"
            class="glass-warm flex flex-col items-center gap-4 rounded-2xl px-6 py-16 text-center"
          >
            <span class="flex size-12 items-center justify-center rounded-full bg-mentora-500/10 text-mentora-400 ring-1 ring-mentora-500/40">
              <UIcon
                name="i-lucide-search-x"
                class="size-6"
                aria-hidden="true"
              />
            </span>
            <p class="font-heading text-xl font-semibold text-highlighted">
              No teachers match your search
            </p>
            <p class="max-w-sm text-sm text-muted">
              Try another word, or pick a different subject.
            </p>
            <UButton
              label="Clear filters"
              data-testid="teachers-clear"
              icon="i-lucide-x"
              color="neutral"
              variant="outline"
              class="rounded-full"
              @click="clearFilters"
            />
          </div>
        </div>
      </UContainer>
    </section>

    <LandingCTA
      v-if="home"
      :page="home"
    />
  </UPage>
</template>
