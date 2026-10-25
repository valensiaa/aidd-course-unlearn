<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

export type Teacher = IndexCollectionItem['teachers']['items'][number]

withDefaults(defineProps<{
  teacher: Teacher
  /** Blob behind the portrait; vary it across a grid of cards (the open `halo` doesn't suit a photo) */
  blob?: BlobVariantName
}>(), {
  blob: 'ember'
})

// In a grid of cards, only the hovered card's blob moves, at the hero's hover speed
const hovered = ref(false)
</script>

<template>
  <article
    data-testid="teacher-card"
    class="flex h-full flex-col gap-5 rounded-2xl bg-elevated/40 p-6 ring-1 ring-default transition hover:ring-mentora-500/40"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Row 1: small portrait (cut-out on a blob) + name and subject -->
    <div class="flex items-center gap-4">
      <div class="relative isolate size-24 shrink-0">
        <BlobBackdrop
          :variant="blob"
          :paused="!hovered"
          :fast="hovered"
          :outline="false"
          class="pointer-events-none absolute inset-0 -z-10"
        />
        <!-- Like <BlobPortrait>: the photo is taller than the blob, so the head rises above
             the blob's top, and its flat cut at the bottom fades out -->
        <div class="absolute inset-x-0 bottom-0 flex h-[112%] justify-center [mask-image:linear-gradient(to_bottom,black_82%,transparent)]">
          <NuxtImg
            v-if="teacher.photo"
            :src="teacher.photo.src"
            :alt="teacher.photo.alt"
            width="81"
            height="108"
            densities="x1 x2"
            loading="lazy"
            class="h-full w-auto object-contain object-bottom"
          />
          <PersonPlaceholder
            v-else
            class="h-full w-auto"
          />
        </div>
      </div>
      <div class="min-w-0">
        <h3
          data-testid="teacher-name"
          class="font-heading text-xl font-semibold text-highlighted"
        >
          {{ teacher.name }}
        </h3>
        <p class="text-sm font-medium text-mentora-400">
          {{ teacher.subject }}
        </p>
      </div>
    </div>

    <!-- Row 2: rating with the price on the right, then the bio -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-4">
        <p class="flex items-center gap-1.5 text-sm text-muted">
          <UIcon
            name="i-lucide-star"
            class="size-4 text-amber-400"
            aria-hidden="true"
          />
          <span class="font-semibold text-highlighted">{{ teacher.rating.toFixed(1) }}</span>
          <span>({{ teacher.reviews }} reviews)</span>
        </p>
        <span class="font-heading text-lg font-semibold text-highlighted">{{ teacher.price }}</span>
      </div>
      <p class="line-clamp-3 text-sm leading-relaxed text-muted">
        {{ teacher.bio }}
      </p>
    </div>
  </article>
</template>
