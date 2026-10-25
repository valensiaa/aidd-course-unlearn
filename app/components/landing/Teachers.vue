<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

// Last word of the title gets the brand gradient, like the hero ("Meet a few of our teachers")
const titleParts = computed(() => highlightTitle(props.page.teachers.title))

// The home page shows at most six cards: featured teachers first, topped up with the rest
const MAX_CARDS = 6
const teachers = computed(() => {
  const items = props.page.teachers.items
  return [...items.filter(t => t.featured), ...items.filter(t => !t.featured)].slice(0, MAX_CARDS)
})

// Cycle the solid blob variants across the cards (the open `halo` doesn't suit a photo)
const CARD_BLOBS: BlobVariantName[] = ['ember', 'shard', 'bloom', 'dusk']
</script>

<template>
  <section
    id="teachers"
    data-testid="teachers-section"
    class="py-20 sm:py-28"
  >
    <UContainer class="max-w-7xl">
      <Motion
        :initial="{ y: 24, opacity: 0 }"
        :while-in-view="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6 }"
        :in-view-options="{ once: true }"
        class="flex flex-wrap items-end justify-between gap-6"
      >
        <div class="max-w-2xl">
          <h2 class="text-3xl font-bold leading-tight tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
            {{ titleParts.lead }} <span class="text-gradient-brand">{{ titleParts.highlight }}</span>
          </h2>
          <p class="mt-5 text-lg leading-relaxed text-muted">
            {{ page.teachers.description }}
          </p>
        </div>
        <UButton
          label="Browse all teachers"
          color="neutral"
          variant="outline"
          size="lg"
          trailing-icon="i-lucide-arrow-right"
          to="/teachers"
          data-testid="teachers-browse-all"
          class="rounded-full"
        />
      </Motion>

      <ul class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Motion
          v-for="(teacher, index) in teachers"
          :key="teacher.name"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.08 * (index % 3) }"
          :in-view-options="{ once: true }"
        >
          <TeacherCard
            :teacher="teacher"
            :blob="CARD_BLOBS[index % CARD_BLOBS.length]"
          />
        </Motion>
      </ul>
    </UContainer>
  </section>
</template>
