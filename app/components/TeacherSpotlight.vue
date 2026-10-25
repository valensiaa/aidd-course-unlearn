<script setup lang="ts">
import type { Teacher } from '~/components/TeacherCard.vue'

// Wide card that puts one teacher in the spotlight: a cut-out portrait on a blob on the left,
// the full profile on the right. Stacks on small screens.
const props = withDefaults(defineProps<{
  teacher: Teacher
  blob?: BlobVariantName
}>(), {
  blob: 'ember'
})

// The spotlight teacher changes with the search and filters, so its photo is often one the
// static build never resized. Serve the original instead (already a small 3:4 WebP)
const { baseURL } = useRuntimeConfig().app
const photoSrc = computed(() => props.teacher.photo && `${baseURL}${props.teacher.photo.src.replace(/^\//, '')}`)
</script>

<template>
  <article
    data-testid="teacher-spotlight"
    class="glass-warm grid overflow-hidden rounded-3xl sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
  >
    <!-- Portrait: the cut-out stands in front of a blob, like the home page hero. Side by
         side with the text, the portrait's frame takes the card's full height, so the blob
         and photo fill about 80% of it -->
    <div class="relative flex items-end justify-center px-10 pt-10 sm:p-0">
      <BlobPortrait
        :variant="blob"
        :outline="false"
        class="w-full max-w-52 sm:absolute sm:inset-y-0 sm:left-1/2 sm:w-auto sm:max-w-none sm:-translate-x-1/2"
      >
        <img
          v-if="teacher.photo && photoSrc"
          :src="photoSrc"
          :alt="teacher.photo.alt"
          width="240"
          height="320"
          class="h-[78%] w-auto object-contain object-bottom sm:h-[85%]"
        >
        <PersonPlaceholder
          v-else
          class="h-[85%] w-auto"
        />
      </BlobPortrait>
    </div>

    <div class="flex flex-col gap-5 p-6 sm:p-8 lg:p-10">
      <p class="inline-flex w-fit items-center gap-2 rounded-full bg-mentora-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-mentora-400 uppercase ring-1 ring-mentora-500/40">
        <UIcon
          name="i-lucide-sparkles"
          class="size-3.5"
          aria-hidden="true"
        />
        Featured teacher
      </p>

      <div>
        <h3
          data-testid="spotlight-name"
          class="font-heading text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
        >
          {{ teacher.name }}
        </h3>
        <p class="mt-1 font-medium text-mentora-400">
          {{ teacher.subject }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
        <p class="flex items-center gap-1.5 text-sm text-muted">
          <UIcon
            name="i-lucide-star"
            class="size-4 text-amber-400"
            aria-hidden="true"
          />
          <span class="font-semibold text-highlighted">{{ teacher.rating.toFixed(1) }}</span>
          <span>({{ teacher.reviews }} reviews)</span>
        </p>
        <span class="font-heading text-xl font-semibold text-highlighted">{{ teacher.price }}</span>
      </div>

      <p class="max-w-prose leading-relaxed text-muted">
        {{ teacher.bio }}
      </p>
    </div>
  </article>
</template>
