<script setup lang="ts">
const colorMode = useColorMode()

const nextTheme = computed(() => (colorMode.value === 'dark' ? 'light' : 'dark'))

const switchTheme = () => {
  colorMode.preference = nextTheme.value
}

const startViewTransition = (event: MouseEvent) => {
  if (!document.startViewTransition) {
    switchTheme()
    return
  }

  const keyframes = circleRevealKeyframes(event.clientX, event.clientY, window.innerWidth, window.innerHeight)

  // Freeze color transitions so the new theme is captured fully applied, not mid-fade
  const root = document.documentElement
  root.classList.add('theme-switching')

  const transition = document.startViewTransition(async () => {
    switchTheme()
    // The color-mode module swaps the <html> class in a watcher; wait for it so the
    // new snapshot shows the new theme instead of flipping halfway through the reveal
    await nextTick()
  })

  transition.finished
    .catch(() => {})
    .finally(() => root.classList.remove('theme-switching'))

  transition.ready.then(() => {
    document.documentElement.animate(keyframes, {
      ...CIRCLE_REVEAL_TIMING,
      pseudoElement: '::view-transition-new(root)'
    })
  }).catch(() => {
    // Skipped (e.g. tab hidden or a second click mid-reveal): the theme still switches
  })
}
</script>

<template>
  <ClientOnly>
    <UButton
      :aria-label="`Switch to ${nextTheme} mode`"
      :icon="`i-lucide-${nextTheme === 'dark' ? 'sun' : 'moon'}`"
      color="neutral"
      variant="ghost"
      size="sm"
      class="rounded-full"
      @click="startViewTransition"
    />
    <template #fallback>
      <div class="size-4" />
    </template>
  </ClientOnly>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) {
  z-index: 9999;
}
::view-transition-old(root) {
  z-index: 1;
}

.theme-switching,
.theme-switching * {
  transition: none !important;
}
</style>
