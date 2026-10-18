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

const motionInitial = { y: 24, opacity: 0, filter: 'blur(12px)' }
const motionAnimate = { y: 0, opacity: 1, filter: 'blur(0px)' }
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
        <Motion
          v-if="eyebrow"
          :initial="motionInitial"
          :animate="motionAnimate"
          :transition="{ duration: 0.6, delay: 0.05 }"
        >
          <p class="mb-5 inline-flex items-center gap-2 rounded-full bg-midnight-900/60 px-4 py-1.5 text-sm font-medium text-mentora-400 ring-1 ring-mentora-500/40 backdrop-blur">
            {{ eyebrow }}
          </p>
        </Motion>

        <Motion
          :initial="motionInitial"
          :animate="motionAnimate"
          :transition="{ duration: 0.6, delay: 0.1 }"
        >
          <h1 class="text-4xl font-bold leading-[1.08] tracking-tight text-highlighted sm:text-5xl lg:text-6xl">
            {{ titleParts.lead }} <span class="text-gradient-brand">{{ titleParts.highlight }}</span>
          </h1>
        </Motion>

        <Motion
          v-if="description"
          :initial="motionInitial"
          :animate="motionAnimate"
          :transition="{ duration: 0.6, delay: 0.2 }"
        >
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {{ description }}
          </p>
        </Motion>

        <Motion
          v-if="slots.actions"
          :initial="motionInitial"
          :animate="motionAnimate"
          :transition="{ duration: 0.6, delay: 0.3 }"
        >
          <div class="mt-10 flex flex-wrap items-center gap-4">
            <slot name="actions" />
          </div>
        </Motion>
      </div>

      <Motion
        v-if="slots.visual"
        :initial="{ scale: 0.95, opacity: 0, filter: 'blur(20px)' }"
        :animate="{ scale: 1, opacity: 1, filter: 'blur(0px)' }"
        :transition="{ duration: 0.8, delay: 0.3 }"
        class="relative mx-auto w-full max-w-md lg:max-w-none"
      >
        <slot name="visual" />
      </Motion>
    </UContainer>
  </section>
</template>
