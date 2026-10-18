<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

// Last word of the title gets the brand gradient, like the hero ("Meet a few of our teachers")
const titleParts = computed(() => highlightTitle(props.page.teachers.title))

// Cycle the solid blob variants across the cards (the open `halo` doesn't suit a photo)
const CARD_BLOBS: BlobVariantName[] = ['ember', 'shard', 'bloom', 'dusk']

// In a grid of six, only the hovered card's blob moves, at the hero's hover speed
const hoveredCard = ref<number>()
</script>

<template>
  <section
    id="teachers"
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
          to="#teachers"
          class="rounded-full"
        />
      </Motion>

      <ul class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Motion
          v-for="(teacher, index) in page.teachers.items"
          :key="teacher.name"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.08 * (index % 3) }"
          :in-view-options="{ once: true }"
        >
          <article
            class="group flex h-full flex-col gap-5 rounded-2xl bg-elevated/40 p-6 ring-1 ring-default transition hover:ring-mentora-500/40"
            @mouseenter="hoveredCard = index"
            @mouseleave="hoveredCard = undefined"
          >
            <!-- Row 1: small portrait (cut-out on a blob) + name and subject -->
            <div class="flex items-center gap-4">
              <div class="relative isolate size-24 shrink-0">
                <BlobBackdrop
                  :variant="CARD_BLOBS[index % CARD_BLOBS.length]"
                  :paused="hoveredCard !== index"
                  :fast="hoveredCard === index"
                  :outline="false"
                  class="pointer-events-none absolute inset-0 -z-10"
                />
                <!-- The photo is smaller than the blob and lifted off its bottom edge, so the whole
                     blob shows around it. The mask fades the photo's bottom cut onto the blob, and
                     softens the top for photos whose hair was cropped flat -->
                <div class="absolute inset-x-0 bottom-[13%] flex h-[62%] justify-center [mask-image:linear-gradient(to_bottom,transparent,black_7%,black_68%,transparent)]">
                  <NuxtImg
                    v-if="teacher.photo"
                    :src="teacher.photo.src"
                    :alt="teacher.photo.alt"
                    width="96"
                    height="96"
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
                <h3 class="font-heading text-xl font-semibold text-highlighted">
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

            <!-- Row 3: the button, pinned to the bottom so rows line up. On devices with hover it
                 appears when the card is hovered or focused; touch screens always show it.
                 The row keeps its space, so the card never changes height. -->
            <div class="mt-auto pt-1 transition duration-300 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <UButton
                label="Book a class"
                :aria-label="`Book a class with ${teacher.name}`"
                size="md"
                trailing-icon="i-lucide-arrow-right"
                class="bg-gradient-brand btn-glow rounded-full text-white transition hover:opacity-90"
              />
            </div>
          </article>
        </Motion>
      </ul>
    </UContainer>
  </section>
</template>
