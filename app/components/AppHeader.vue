<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

// Frosted background once the page scrolls, so the logo and button stay readable over content
const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 8)

// Mobile menu closes whenever the route changes
const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => {
  menuOpen.value = false
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition duration-300"
    :class="scrolled ? 'bg-default/70 backdrop-blur-md shadow-[0_1px_0_0] shadow-white/5' : ''"
  >
    <UContainer class="relative max-w-7xl flex items-center justify-between gap-4 py-3 sm:py-4">
      <AppLogo />

      <!-- Desktop / tablet: the navigation, centred, with no background of its own; once the page
           scrolls the frosted header bar behind it keeps the links readable -->
      <UNavigationMenu
        :items="links"
        variant="link"
        color="neutral"
        class="px-2 sm:px-4 max-md:hidden md:absolute md:left-1/2 md:-translate-x-1/2"
        :ui="{
          link: 'px-2 py-1',
          linkLeadingIcon: 'hidden'
        }"
      >
        <template #list-trailing>
          <ColorModeButton />
        </template>
      </UNavigationMenu>

      <div class="flex items-center gap-2">
        <UButton
          to="/#teachers"
          trailing-icon="i-lucide-arrow-right"
          class="bg-gradient-brand btn-glow rounded-full px-5 py-2 font-semibold text-white transition hover:opacity-90 max-sm:hidden"
        >
          Find a teacher
        </UButton>

        <!-- Phones: links, theme toggle and the call-to-action in a side panel -->
        <USlideover
          v-model:open="menuOpen"
          title="Menu"
          class="md:hidden"
          :ui="{ content: 'max-w-xs' }"
        >
          <UButton
            icon="i-lucide-menu"
            aria-label="Open menu"
            color="neutral"
            variant="outline"
            class="rounded-full md:hidden"
          />

          <template #body>
            <div class="flex h-full flex-col gap-6">
              <UNavigationMenu
                :items="links"
                orientation="vertical"
                color="neutral"
                :ui="{ link: 'text-base py-2.5' }"
              />
              <div class="flex items-center justify-between border-t border-default pt-4">
                <span class="text-sm text-muted">Theme</span>
                <ColorModeButton />
              </div>
              <UButton
                to="/#teachers"
                trailing-icon="i-lucide-arrow-right"
                size="lg"
                block
                class="bg-gradient-brand btn-glow mt-auto rounded-full font-semibold text-white transition hover:opacity-90"
              >
                Find a teacher
              </UButton>
            </div>
          </template>
        </USlideover>
      </div>
    </UContainer>
  </header>
</template>
