<script setup lang="ts">
import type { Teacher } from '~/components/TeacherCard.vue'

// Wide card that puts one teacher in the spotlight: a cut-out portrait on a blob on the left,
// the full profile and booking actions on the right. Stacks on small screens.
const props = withDefaults(defineProps<{
  teacher: Teacher
  blob?: BlobVariantName
}>(), {
  blob: 'ember'
})

// No booking flow yet: booking requests and questions go to Mentora by email
const { global } = useAppConfig()
const mailto = (subject: string) => `mailto:${global.email}?subject=${encodeURIComponent(subject)}`
const bookingLink = computed(() => mailto(`Book a class with ${props.teacher.name}`))
const questionLink = computed(() => mailto(`A question for ${props.teacher.name}`))
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
        <NuxtImg
          v-if="teacher.photo"
          :src="teacher.photo.src"
          :alt="teacher.photo.alt"
          width="240"
          height="320"
          densities="x1 x2"
          class="h-[78%] w-auto object-contain object-bottom sm:h-[85%]"
        />
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

      <div class="mt-auto flex flex-wrap gap-3 pt-2">
        <UButton
          label="Book a class"
          :aria-label="`Book a class with ${teacher.name}`"
          data-testid="spotlight-book"
          :to="bookingLink"
          size="lg"
          trailing-icon="i-lucide-arrow-right"
          class="bg-gradient-brand btn-glow rounded-full px-6 font-semibold text-white transition hover:opacity-90"
        />
        <UButton
          label="Ask a question"
          :aria-label="`Ask ${teacher.name} a question`"
          :to="questionLink"
          icon="i-lucide-message-circle"
          color="neutral"
          variant="outline"
          size="lg"
          class="rounded-full bg-transparent px-6 font-semibold text-highlighted ring-default transition hover:bg-elevated/50 dark:ring-white/25 dark:hover:bg-white/5"
        />
      </div>
    </div>
  </article>
</template>
