<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

// Last four words of the title get the brand gradient ("teacher who gets you")
const titleParts = computed(() => {
  const words = props.page.hero.title.split(' ')
  const split = Math.max(words.length - 4, 0)
  return {
    // Break the lead after its comma, like the mockup: "Learn anything," / "one-on-one with a"
    lead: words.slice(0, split).join(' ').split(/(?<=,)\s+/),
    highlight: words.slice(split).join(' ')
  }
})

const avatars = computed(() => props.page.teachers?.items?.slice(0, 3).map(item => item.avatar) ?? [])

const [primaryLink, secondaryLink] = props.page.hero.links

// Blobs speed up while the pointer is over the hero
const blobsFast = ref(false)

const motionInitial = {
  y: 24,
  opacity: 0,
  filter: 'blur(12px)'
}
const motionAnimate = {
  y: 0,
  opacity: 1,
  filter: 'blur(0px)'
}
</script>

<template>
  <section class="relative isolate overflow-x-clip" @mouseenter="blobsFast = true" @mouseleave="blobsFast = false">
    <!-- Corner blob: top-right (rotated) up to tablet, bottom-left spilling out of the hero on desktop -->
    <div v-parallax="0.15"
      class="pointer-events-none absolute top-0 right-0 -z-10 aspect-3/2 w-[40vw] max-w-[346px] rotate-180 opacity-80 lg:top-auto lg:right-auto lg:bottom-0 lg:left-0 lg:translate-y-1/2 lg:rotate-0 lg:[mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
      <LandingHeroCornerBlob :fast="blobsFast" class="size-full" />
    </div>

    <UContainer
      class="max-w-7xl grid items-center gap-16 pt-24 pb-16 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:py-28">
      <!-- Copy -->
      <div class="max-w-xl">
        <Motion :initial="motionInitial" :animate="motionAnimate" :transition="{ duration: 0.6, delay: 0.1 }">
          <NuxtLink to="#teachers" data-testid="hero-teachers-badge"
            class="group inline-flex items-center gap-3 rounded-full border border-mentora-500/40 bg-elevated/40 py-1.5 pl-1.5 pr-4 text-xs text-highlighted dark:bg-midnight-900/60 sm:text-sm backdrop-blur transition hover:border-mentora-500/70">
            <span class="flex -space-x-2.5">
              <NuxtImg v-for="(avatar, index) in avatars" :key="index" :src="avatar.src" :alt="avatar.alt" width="36"
                height="36"
                class="size-7 rounded-full sm:size-9 object-cover ring-2 ring-white dark:ring-midnight-950" />
            </span>
            <span>
              12,000+ passionate, <span class="text-mentora-400">vetted teachers</span>
            </span>
            <UIcon name="i-lucide-chevron-right"
              class="size-4 text-mentora-400 transition group-hover:translate-x-0.5" />
          </NuxtLink>
        </Motion>

        <Motion :initial="motionInitial" :animate="motionAnimate" :transition="{ duration: 0.6, delay: 0.2 }">
          <h1 data-testid="page-title" class="mt-8 text-4xl font-bold leading-[1.08] tracking-tight text-highlighted sm:text-5xl lg:text-6xl">
            <span v-for="(line, index) in titleParts.lead" :key="index" class="block">{{ line }}</span>
            <span class="text-gradient-brand">{{ titleParts.highlight }}</span>
          </h1>
        </Motion>

        <Motion :initial="motionInitial" :animate="motionAnimate" :transition="{ duration: 0.6, delay: 0.3 }">
          <p class="mt-6 max-w-lg text-lg leading-relaxed text-muted dark:text-midnight-300">
            {{ page.hero.description }}
          </p>
        </Motion>

        <Motion :initial="motionInitial" :animate="motionAnimate" :transition="{ duration: 0.6, delay: 0.4 }">
          <div class="mt-10 flex flex-wrap items-center gap-4">
            <UButton v-if="primaryLink" data-testid="hero-primary-cta" :to="primaryLink.to" :icon="primaryLink.icon"
              trailing-icon="i-lucide-arrow-right" size="xl"
              class="bg-gradient-brand btn-glow transition rounded-full px-8 py-4 text-base font-semibold text-white hover:opacity-90">
              {{ primaryLink.label }}
            </UButton>
            <UButton v-if="secondaryLink" data-testid="hero-secondary-cta" :to="secondaryLink.to" color="neutral" variant="outline" size="xl"
              class="transition rounded-full bg-transparent px-8 py-4 text-base font-semibold text-highlighted ring-default hover:bg-elevated/50 dark:ring-white/25 dark:hover:bg-white/5">
              {{ secondaryLink.label }}
            </UButton>
          </div>
        </Motion>
      </div>

      <!-- Visual -->
      <Motion :initial="{ scale: 0.95, opacity: 0, filter: 'blur(20px)' }"
        :animate="{ scale: 1, opacity: 1, filter: 'blur(0px)' }" :transition="{ duration: 0.8, delay: 0.3 }"
        class="relative mx-auto w-full max-w-xl lg:max-w-none">
        <BlobBackdrop v-parallax="0.06" variant="hero" :fast="blobsFast"
          class="pointer-events-none absolute -inset-x-[12%] -top-[18%] -bottom-[8%] -z-10 h-[126%] w-[124%] max-w-none" />
        <LandingHeroVideo v-parallax="-0.04">
          <NuxtImg src="/hero/hero-student@2x.jpg" alt="A student smiling while taking notes during an online class"
            width="620" height="548" densities="x1 x2" format="webp" preload fetchpriority="high"
            class="size-full object-cover" />
        </LandingHeroVideo>
      </Motion>
    </UContainer>
  </section>
</template>
