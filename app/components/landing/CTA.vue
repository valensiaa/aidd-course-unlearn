<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

// Last three words of the title get the brand gradient ("one lesson away")
const titleParts = computed(() => {
  const words = props.page.cta.title.split(' ')
  return { lead: words.slice(0, -3).join(' '), highlight: words.slice(-3).join(' ') }
})

const [primaryLink, ...otherLinks] = props.page.cta.links
</script>

<template>
  <section
    id="cta"
    class="overflow-x-clip py-20 sm:py-28"
  >
    <UContainer class="max-w-7xl">
      <Motion
        :initial="{ y: 24, opacity: 0 }"
        :while-in-view="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6 }"
        :in-view-options="{ once: true }"
        class="relative isolate"
      >
        <!-- Blob behind the card and its photo, larger than the card so it overlaps the card's
             top, bottom and left borders; inside the card it shows through the glass -->
        <BlobBackdrop
          variant="ember"
          class="pointer-events-none absolute top-1/2 -left-24 -z-10 size-[40rem] -translate-y-1/2 max-lg:hidden"
        />

        <div class="glass-warm relative overflow-hidden rounded-3xl px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          <!-- Photo filling the card's full height on the left: the card's corners round its left
               side, and its right side gets the same radius -->
          <NuxtImg
            src="/hero/random-7.avif"
            alt="An open book, a notebook and a pen on a table"
            width="400"
            height="500"
            densities="x1 x2"
            format="webp"
            loading="lazy"
            class="absolute inset-y-0 left-0 aspect-[4/5] h-full rounded-r-3xl object-cover max-lg:hidden"
          />

          <!-- Text stays clear of the photo on narrower laptop screens -->
          <div class="max-w-xl lg:ml-auto lg:max-w-[min(36rem,calc(100%-26rem))]">
            <h2 class="text-3xl font-bold leading-tight tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
              {{ titleParts.lead }} <span class="text-gradient-brand">{{ titleParts.highlight }}</span>
            </h2>
            <p class="mt-5 text-lg leading-relaxed text-muted">
              {{ page.cta.description }}
            </p>

            <div class="mt-10 flex flex-wrap items-center gap-4">
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
                v-for="link in otherLinks"
                :key="link.label"
                :to="link.to"
                :icon="link.icon"
                :target="link.target"
                color="neutral"
                variant="outline"
                size="xl"
                class="rounded-full bg-transparent px-8 py-4 text-base font-semibold text-white ring-white/25 transition hover:bg-white/5"
              >
                {{ link.label }}
              </UButton>
            </div>
          </div>
        </div>
      </Motion>
    </UContainer>
  </section>
</template>
