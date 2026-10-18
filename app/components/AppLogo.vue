<script setup lang="ts">
// Mentora logo: a small faceted blob and the wordmark. The blob holds still and comes alive
// while the logo is hovered or focused.
const active = ref(false)
</script>

<template>
  <NuxtLink
    to="/"
    aria-label="Mentora home"
    class="group flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mentora-400"
    @mouseenter="active = true"
    @mouseleave="active = false"
    @focus="active = true"
    @blur="active = false"
  >
    <BlobBackdrop
      variant="ember"
      :outline="false"
      :paused="!active"
      :fast="active"
      class="size-9 shrink-0"
    />
    <span class="font-heading text-xl font-bold tracking-tight text-highlighted">Mentora</span>
  </NuxtLink>
</template>
