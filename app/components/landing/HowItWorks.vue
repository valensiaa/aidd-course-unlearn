<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :id="'how-it-works'"
    :title="page.howItWorks.title"
    :description="page.howItWorks.description"
    :ui="{
      title: 'text-2xl sm:text-3xl lg:text-3xl font-medium',
      description: 'mt-3 text-sm sm:text-md text-muted'
    }"
  >
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Motion
        v-for="(step, index) in page.howItWorks.steps"
        :key="index"
        :initial="{ opacity: 0, transform: 'translateY(20px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.15 * index }"
        :in-view-options="{ once: true }"
      >
        <div class="relative h-full flex flex-col gap-4 rounded-xl bg-elevated/40 p-6 ring-1 ring-default hover:ring-primary/40 transition-all">
          <span class="absolute right-5 top-5 text-5xl font-heading font-semibold text-primary/10">
            {{ index + 1 }}
          </span>
          <div class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon
              :name="step.icon"
              class="size-6"
            />
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="font-heading text-lg font-medium text-highlighted">
              {{ step.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ step.description }}
            </p>
          </div>
        </div>
      </Motion>
    </div>
  </UPageSection>
</template>
