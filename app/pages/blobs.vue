<script setup lang="ts">
// Development-only preview of the blob variants as backdrops for cut-out portraits
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({ title: 'Blob variants', robots: 'noindex' })

const samples: { variant: BlobVariantName, note: string }[] = [
  { variant: 'ember', note: 'Rounded pebble in the hero colors' },
  { variant: 'shard', note: 'Crystal with large facets, lit from the top right' },
  { variant: 'bloom', note: 'Five soft lobes in deeper reds' },
  { variant: 'dusk', note: 'Dark and muted, for bright clothing' },
  { variant: 'halo', note: 'Faceted ring framing the head' }
]
</script>

<template>
  <UContainer class="max-w-6xl py-24">
    <h1 class="text-3xl font-bold text-highlighted">
      Blob variants
    </h1>
    <p class="mt-2 text-muted">
      Grey silhouettes stand in for cut-out photos of people. Hover a portrait to speed its blob up.
    </p>

    <div class="mt-12 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      <figure
        v-for="sample in samples"
        :key="sample.variant"
        class="flex flex-col items-center gap-4"
      >
        <BlobPortrait
          :variant="sample.variant"
          class="w-full max-w-72"
        >
          <PersonPlaceholder class="h-full w-auto" />
        </BlobPortrait>
        <figcaption class="text-center">
          <code class="font-semibold text-highlighted">{{ sample.variant }}</code>
          <p class="text-sm text-muted">
            {{ sample.note }}
          </p>
        </figcaption>
      </figure>
    </div>
  </UContainer>
</template>
