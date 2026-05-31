<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const motionInitial = {
  scale: 1.1,
  opacity: 0,
  filter: 'blur(20px)'
}
const motionAnimate = {
  scale: 1,
  opacity: 1,
  filter: 'blur(0px)'
}
</script>

<template>
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-3xl mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="motionInitial"
        :animate="motionAnimate"
        :transition="{ duration: 0.6, delay: 0.1 }"
      >
        <UBadge
          v-if="page.hero.headline"
          color="primary"
          variant="subtle"
          size="lg"
          class="rounded-full"
        >
          <template #leading>
            <UIcon
              name="i-lucide-sparkles"
              class="size-4"
            />
          </template>
          {{ page.hero.headline }}
        </UBadge>
      </Motion>
    </template>

    <template #title>
      <Motion
        :initial="motionInitial"
        :animate="motionAnimate"
        :transition="{ duration: 0.6, delay: 0.1 }"
      >
        {{ page.hero.title }}
      </Motion>
    </template>

    <template #description>
      <Motion
        :initial="motionInitial"
        :animate="motionAnimate"
        :transition="{ duration: 0.6, delay: 0.3 }"
      >
        {{ page.hero.description }}
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="motionInitial"
        :animate="motionAnimate"
        :transition="{ duration: 0.6, delay: 0.5 }"
      >
        <div
          v-if="page.hero.links"
          class="flex flex-wrap items-center justify-center gap-2"
        >
          <UButton
            v-for="(link, index) in page.hero.links"
            :key="index"
            v-bind="link"
          />
        </div>
      </Motion>

      <Motion
        :initial="motionInitial"
        :animate="motionAnimate"
        :transition="{ duration: 0.6, delay: 0.7 }"
      >
        <div class="mt-6 flex items-center justify-center gap-x-6 gap-y-2 flex-wrap text-sm text-muted">
          <span class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-users"
              class="size-4 text-primary"
            />
            12,000+ teachers
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-book-open"
              class="size-4 text-primary"
            />
            300+ subjects
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-star"
              class="size-4 text-primary"
            />
            4.9 average rating
          </span>
        </div>
      </Motion>
    </template>

    <UMarquee
      pause-on-hover
      class="py-2 -mx-8 sm:-mx-12 lg:-mx-16 [--duration:40s]"
    >
      <Motion
        v-for="(img, index) in page.hero.images"
        :key="index"
        :initial="motionInitial"
        :animate="motionAnimate"
        :transition="{ duration: 0.6, delay: index * 0.1 }"
      >
        <NuxtImg
          width="234"
          height="234"
          class="rounded-lg aspect-square object-cover"
          :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
          v-bind="img"
        />
      </Motion>
    </UMarquee>
  </UPageHero>
</template>
