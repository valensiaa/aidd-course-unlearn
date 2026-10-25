<script setup lang="ts">
// Hero-style header for inner pages: a large heading with its last words in the brand
// gradient, a description, optional actions, and an optional visual on the right.
// A blob peeks in from the top-right corner, echoing the home page hero.
const props = withDefaults(defineProps<{
  title: string
  description?: string
  /** How many of the title's last words get the gradient */
  highlight?: number
  /** Small label above the heading */
  eyebrow?: string
}>(), {
  highlight: 1
})

const slots = defineSlots<{
  actions?: () => unknown
  visual?: () => unknown
}>()

const titleParts = computed(() => highlightTitle(props.title, props.highlight))
</script>

<template>
  <section class="relative isolate overflow-x-clip">
    <!-- Corner blob, partly off-screen at the top right -->
    <BlobBackdrop
      v-parallax="0.15"
      variant="dusk"
      :outline="false"
      class="pointer-events-none absolute -top-40 -right-40 -z-10 size-[26rem] opacity-80 sm:-top-48 sm:-right-48 sm:size-[32rem]"
    />

    <UContainer
      class="max-w-7xl grid items-center gap-14 pt-32 pb-12 sm:pt-36 lg:pb-16"
      :class="slots.visual ? 'lg:grid-cols-[1fr_0.9fr] lg:gap-16' : ''"
    >
      <div class="max-w-2xl">
        <div
          v-if="eyebrow"
          class="hero-enter"
          style="--enter-delay: 50ms"
        >
          <p class="mb-5 inline-flex items-center gap-2 rounded-full bg-elevated/40 px-4 py-1.5 text-sm font-medium text-mentora-400 ring-1 ring-mentora-500/40 backdrop-blur dark:bg-midnight-900/60">
            {{ eyebrow }}
          </p>
        </div>

        <div
          class="hero-enter"
          style="--enter-delay: 100ms"
        >
          <h1
            data-testid="page-title"
            class="text-4xl font-bold leading-[1.08] tracking-tight text-highlighted sm:text-5xl lg:text-6xl"
          >
            {{ titleParts.lead }} <span class="text-gradient-brand">{{ titleParts.highlight }}</span>
          </h1>
        </div>

        <div
          v-if="description"
          class="hero-enter"
          style="--enter-delay: 200ms"
        >
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {{ description }}
          </p>
        </div>

        <div
          v-if="slots.actions"
          class="hero-enter"
          style="--enter-delay: 300ms"
        >
          <div class="mt-10 flex flex-wrap items-center gap-4">
            <slot name="actions" />
          </div>
        </div>
      </div>

      <div
        v-if="slots.visual"
        class="hero-enter-visual relative mx-auto w-full max-w-md lg:max-w-none"
        style="--enter-delay: 300ms"
      >
        <slot name="visual" />
      </div>
    </UContainer>
  </section>
</template>
