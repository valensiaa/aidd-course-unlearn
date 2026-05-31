<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :id="'teachers'"
    :title="page.teachers.title"
    :description="page.teachers.description"
    :ui="{
      title: 'text-2xl sm:text-3xl lg:text-3xl font-medium',
      description: 'mt-3 text-sm sm:text-md text-muted'
    }"
  >
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Motion
        v-for="(teacher, index) in page.teachers.items"
        :key="index"
        :initial="{ opacity: 0, transform: 'translateY(20px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.1 * index }"
        :in-view-options="{ once: true }"
      >
        <div class="group h-full flex flex-col gap-4 rounded-xl bg-elevated/40 p-5 ring-1 ring-default hover:ring-primary/40 transition-all">
          <div class="flex items-center gap-4">
            <UAvatar
              :src="teacher.avatar.src"
              :alt="teacher.avatar.alt"
              size="2xl"
              class="ring-2 ring-default ring-offset-2 ring-offset-bg"
            />
            <div class="flex flex-col gap-0.5">
              <h3 class="font-heading text-lg font-medium text-highlighted">
                {{ teacher.name }}
              </h3>
              <p class="text-sm text-primary">
                {{ teacher.subject }}
              </p>
              <div class="mt-0.5 flex items-center gap-1 text-xs text-muted">
                <UIcon
                  name="i-lucide-star"
                  class="size-3.5 text-amber-400"
                />
                <span class="font-medium text-highlighted">{{ teacher.rating }}</span>
                <span>({{ teacher.reviews }} reviews)</span>
              </div>
            </div>
          </div>

          <p class="flex-1 text-sm text-muted">
            {{ teacher.bio }}
          </p>

          <div class="flex items-center justify-between border-t border-default pt-4">
            <span class="text-sm font-medium text-highlighted">{{ teacher.price }}</span>
            <UButton
              label="Book a class"
              color="primary"
              variant="soft"
              size="sm"
              trailing-icon="i-lucide-arrow-right"
              :ui="{ trailingIcon: 'transition-transform group-hover:translate-x-0.5' }"
            />
          </div>
        </div>
      </Motion>
    </div>

    <template #footer>
      <div class="flex justify-center">
        <UButton
          label="Browse all teachers"
          color="neutral"
          variant="subtle"
          size="lg"
          trailing-icon="i-lucide-arrow-right"
          to="#teachers"
        />
      </div>
    </template>
  </UPageSection>
</template>
