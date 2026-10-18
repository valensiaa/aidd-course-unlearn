<script setup lang="ts">
// Cut-out portrait (a person on a transparent background) standing in front of an animated
// blob. The blob is anchored low in a 4:5 frame so the head can rise above it, and the flat
// cut at the bottom of the photo fades out. Hovering speeds the blob up.
//
// Usage: pass the cut-out as the slot, bottom-aligned and fitted to the frame's height:
//   <BlobPortrait variant="shard">
//     <NuxtImg src="/people/sofia.png" alt="Sofía Herrera" class="h-full w-auto object-contain object-bottom" />
//   </BlobPortrait>
withDefaults(defineProps<{
  variant?: BlobVariantName
  outline?: boolean
}>(), {
  variant: 'ember',
  outline: true
})

const hovered = ref(false)
</script>

<template>
  <div
    class="relative isolate aspect-[4/5]"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <BlobBackdrop
      :variant="variant"
      :outline="outline"
      :fast="hovered"
      class="pointer-events-none absolute inset-x-[5%] bottom-[5%] -z-10 aspect-square"
    />
    <div class="absolute inset-0 flex items-end justify-center [mask-image:linear-gradient(to_bottom,black_82%,transparent)]">
      <slot />
    </div>
  </div>
</template>
