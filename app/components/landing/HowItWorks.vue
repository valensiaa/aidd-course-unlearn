<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

// One of the backdrop blobs at random, picked once on the server so the client matches it
const blobVariant = useState<BlobVariantName>(
  'how-it-works-blob',
  () => BACKDROP_BLOB_VARIANTS[Math.floor(Math.random() * BACKDROP_BLOB_VARIANTS.length)]!
)

// Last word of the title gets the brand gradient, like the hero ("How Mentora works")
const titleParts = computed(() => highlightTitle(props.page.howItWorks.title))
</script>

<template>
  <section
    id="how-it-works"
    class="relative py-20 sm:py-28"
  >
    <UContainer class="max-w-7xl grid items-center gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <!-- Person in front of a blob -->
      <Motion
        :initial="{ scale: 0.95, opacity: 0, filter: 'blur(20px)' }"
        :while-in-view="{ scale: 1, opacity: 1, filter: 'blur(0px)' }"
        :transition="{ duration: 0.8 }"
        :in-view-options="{ once: true }"
        class="mx-auto w-full max-w-md"
      >
        <BlobPortrait
          v-parallax="0.05"
          :variant="blobVariant"
        >
          <NuxtImg
            v-if="page.howItWorks.image"
            :src="page.howItWorks.image.src"
            :alt="page.howItWorks.image.alt"
            class="h-[62%] w-auto object-contain object-bottom"
          />
          <PersonPlaceholder
            v-else
            class="h-full w-auto"
          />
        </BlobPortrait>
      </Motion>

      <!-- Steps -->
      <div>
        <Motion
          :initial="{ y: 24, opacity: 0 }"
          :while-in-view="{ y: 0, opacity: 1 }"
          :transition="{ duration: 0.6 }"
          :in-view-options="{ once: true }"
        >
          <h2 class="text-3xl font-bold leading-tight tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
            {{ titleParts.lead }} <span class="text-gradient-brand">{{ titleParts.highlight }}</span>
          </h2>
          <p class="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {{ page.howItWorks.description }}
          </p>
        </Motion>

        <ol class="mt-12 flex flex-col">
          <Motion
            v-for="(step, index) in page.howItWorks.steps"
            :key="index"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.12 * index }"
            :in-view-options="{ once: true }"
            class="relative flex gap-5 pb-9 last:pb-0"
          >
            <!-- line joining this step's badge to the next one -->
            <span
              v-if="index < page.howItWorks.steps.length - 1"
              aria-hidden="true"
              class="absolute top-12 bottom-1 left-[22px] w-px bg-linear-to-b from-mentora-500/50 to-mentora-500/10"
            />
            <div class="flex size-11 shrink-0 items-center justify-center rounded-full bg-mentora-500/10 text-mentora-400 ring-1 ring-mentora-500/40">
              <UIcon
                :name="step.icon"
                class="size-5"
              />
            </div>
            <div class="pt-0.5">
              <p class="text-xs font-semibold uppercase tracking-widest text-mentora-400">
                Step {{ index + 1 }}
              </p>
              <h3 class="mt-1 font-heading text-xl font-semibold text-highlighted">
                {{ step.title }}
              </h3>
              <p class="mt-1.5 max-w-lg leading-relaxed text-muted">
                {{ step.description }}
              </p>
            </div>
          </Motion>
        </ol>
      </div>
    </UContainer>
  </section>
</template>
