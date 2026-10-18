<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

// Last word of the title gets the brand gradient, like the other sections
const titleParts = computed(() => {
  const words = props.page.testimonials.title.split(' ')
  return { lead: words.slice(0, -1).join(' '), highlight: words.at(-1) }
})

const items = computed(() => props.page.testimonials.items)
const active = ref(0)

const go = (step: number) => {
  const count = items.value.length
  active.value = (active.value + step + count) % count
}

// Signed distance from the active card, wrapping around so the fan is endless both ways
function offsetOf(index: number) {
  const count = items.value.length
  let offset = (index - active.value) % count
  if (offset > count / 2) offset -= count
  if (offset < -count / 2) offset += count
  return offset
}

// Small fixed tilts so the fanned-out cards look hand-placed; the active card stands straight
const TILTS = [-2.5, 1.5, -1, 2, -1.5, 1, -2]
const VISIBLE_RANGE = 2

function cardStyle(index: number) {
  const offset = offsetOf(index)
  const distance = Math.abs(offset)
  return {
    transform: `translateX(calc(${offset} * var(--step))) translateY(${distance * 0.75}rem) rotate(${offset === 0 ? 0 : TILTS[index % TILTS.length]}deg) scale(${1 - Math.min(distance, 3) * 0.08})`,
    zIndex: 10 - distance,
    // Cards beyond the visible fan fade out, so the one wrapping to the other side is never seen crossing
    opacity: distance > VISIBLE_RANGE ? 0 : 1
  }
}

const stage = useTemplateRef<HTMLElement>('stage')
useSwipe(stage, {
  onSwipeEnd: (_event, direction) => {
    if (direction === 'left') go(1)
    else if (direction === 'right') go(-1)
  }
})
</script>

<template>
  <section
    id="testimonials"
    class="relative isolate overflow-hidden py-20 sm:py-28"
  >
    <!-- Blobs behind the cards (they show through the glass): a smaller one at the bottom
         left here, and one on the right inside the card area below -->
    <BlobBackdrop
      variant="dusk"
      class="pointer-events-none absolute bottom-6 -left-32 -z-10 size-[22rem] opacity-90 max-lg:hidden"
    />

    <UContainer class="max-w-7xl">
      <Motion
        :initial="{ y: 24, opacity: 0 }"
        :while-in-view="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6 }"
        :in-view-options="{ once: true }"
        class="mx-auto max-w-2xl text-center"
      >
        <h2 class="text-3xl font-bold leading-tight tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
          {{ titleParts.lead }} <span class="text-gradient-brand">{{ titleParts.highlight }}</span>
        </h2>
        <p class="mt-5 text-lg leading-relaxed text-muted">
          {{ page.testimonials.description }}
        </p>
      </Motion>
    </UContainer>

    <div
      ref="stage"
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      class="relative mt-14 h-[27rem] touch-pan-y [--card-w:min(26rem,84vw)] [--step:80vw] sm:[--step:19rem] lg:[--step:21rem]"
    >
      <!-- Right blob, placed against the cards so its top third shows above the right-hand ones -->
      <BlobBackdrop
        variant="bloom"
        class="pointer-events-none absolute -top-24 -right-40 -z-10 size-[30rem] opacity-90 max-lg:hidden"
      />
      <article
        v-for="(item, index) in items"
        :key="item.author.name"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${index + 1} of ${items.length}`"
        :aria-hidden="offsetOf(index) !== 0"
        class="glass-warm absolute top-4 left-[calc(50%-var(--card-w)/2)] flex h-[23rem] w-(--card-w) flex-col overflow-hidden rounded-xl p-7 transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] [clip-path:polygon(0_0,calc(100%-2.5rem)_0,100%_2.5rem,100%_100%,0_100%)] motion-reduce:transition-none"
        :class="offsetOf(index) === 0 ? '' : 'cursor-pointer'"
        :style="cardStyle(index)"
        @click="offsetOf(index) !== 0 && go(offsetOf(index))"
      >
        <!-- Light face of the active card, faded in and out -->
        <div
          aria-hidden="true"
          class="absolute inset-0 bg-midnight-50 transition-opacity duration-700"
          :class="offsetOf(index) === 0 ? 'opacity-100' : 'opacity-0'"
        />
        <!-- Folded top-right corner -->
        <div
          aria-hidden="true"
          class="absolute top-0 right-0 size-10 transition-colors duration-700 [clip-path:polygon(0_0,0_100%,100%_100%)]"
          :class="offsetOf(index) === 0 ? 'bg-gradient-brand' : 'bg-white/10'"
        />

        <div class="relative flex h-full flex-col">
          <span
            aria-hidden="true"
            class="text-gradient-brand font-heading text-6xl leading-none"
          >“</span>
          <blockquote
            class="mt-2 line-clamp-7 text-base leading-relaxed font-medium transition-colors duration-700 sm:text-[1.0625rem]"
            :class="offsetOf(index) === 0 ? 'text-midnight-950' : 'text-white'"
          >
            {{ item.quote }}
          </blockquote>

          <div class="mt-auto flex items-center gap-3 pt-5">
            <UAvatar
              :src="item.author.avatar?.src"
              :alt="item.author.name"
              size="lg"
              class="ring-2 ring-mentora-500/40"
            />
            <div>
              <p
                class="font-heading font-semibold transition-colors duration-700"
                :class="offsetOf(index) === 0 ? 'text-midnight-950' : 'text-white'"
              >
                {{ item.author.name }}
              </p>
              <p
                class="text-sm transition-colors duration-700"
                :class="offsetOf(index) === 0 ? 'text-midnight-600' : 'text-midnight-300'"
              >
                {{ item.author.description }}
              </p>
            </div>
          </div>
        </div>
      </article>

      <!-- Announce the newly active testimonial to screen readers -->
      <p
        class="sr-only"
        aria-live="polite"
      >
        Testimonial {{ active + 1 }} of {{ items.length }}: {{ items[active]?.author.name }}
      </p>
    </div>

    <div class="mt-8 flex justify-center gap-3">
      <UButton
        icon="i-lucide-arrow-left"
        aria-label="Previous testimonial"
        color="neutral"
        variant="outline"
        size="xl"
        class="rounded-full"
        @click="go(-1)"
      />
      <UButton
        icon="i-lucide-arrow-right"
        aria-label="Next testimonial"
        size="xl"
        class="bg-gradient-brand btn-glow rounded-full text-white transition hover:opacity-90"
        @click="go(1)"
      />
    </div>
  </section>
</template>
