<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <UFooter
    data-testid="site-footer"
    class="z-10 bg-default"
    :ui="{ left: 'text-muted text-xs' }"
  >
    <template #left>
      {{ footer.credits }}
    </template>
  </UFooter>
</template>
