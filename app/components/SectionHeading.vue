<script setup lang="ts">
// Section heading in the home page style: last words in the brand gradient, fades in on scroll
const props = withDefaults(defineProps<{
  title: string
  description?: string
  highlight?: number
  align?: 'left' | 'center'
}>(), {
  highlight: 1,
  align: 'left'
})

const titleParts = computed(() => highlightTitle(props.title, props.highlight))
</script>

<template>
  <Motion
    :initial="{ y: 24, opacity: 0 }"
    :while-in-view="{ y: 0, opacity: 1 }"
    :transition="{ duration: 0.6 }"
    :in-view-options="{ once: true }"
    class="max-w-2xl"
    :class="align === 'center' ? 'mx-auto text-center' : ''"
  >
    <h2 class="text-3xl font-bold leading-tight tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
      {{ titleParts.lead }} <span class="text-gradient-brand">{{ titleParts.highlight }}</span>
    </h2>
    <p
      v-if="description"
      class="mt-5 text-lg leading-relaxed text-muted"
    >
      {{ description }}
    </p>
  </Motion>
</template>
