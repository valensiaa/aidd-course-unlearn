<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('about').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

// The home page content holds the shared call-to-action that closes every page
const { data: home } = await useAsyncData('index', () => queryCollection('index').first())

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})

const [firstImage, secondImage] = page.value.images
</script>

<template>
  <UPage v-if="page">
    <PageHero
      eyebrow="About Mentora"
      :title="page.title"
      :description="page.description"
    >
      <template #actions>
        <UButton
          to="/#teachers"
          icon="i-lucide-search"
          trailing-icon="i-lucide-arrow-right"
          size="xl"
          class="bg-gradient-brand btn-glow rounded-full px-8 py-4 text-base font-semibold text-white transition hover:opacity-90"
        >
          Find a teacher
        </UButton>
        <UButton
          to="/subjects"
          data-testid="about-browse-subjects"
          color="neutral"
          variant="outline"
          size="xl"
          class="rounded-full bg-transparent px-8 py-4 text-base font-semibold text-highlighted ring-default transition hover:bg-elevated/50 dark:ring-white/25 dark:hover:bg-white/5"
        >
          Browse subjects
        </UButton>
      </template>

      <!-- Two framed photos overlapping on a blob -->
      <template #visual>
        <div class="relative isolate mx-auto aspect-square w-full max-w-lg">
          <BlobBackdrop
            variant="ember"
            class="pointer-events-none absolute inset-[6%] -z-10"
          />
          <div
            v-if="firstImage"
            v-parallax="-0.05"
            class="photo-frame absolute top-[8%] left-[6%] aspect-[4/5] w-[48%] -rotate-3"
          >
            <NuxtImg
              :src="firstImage.src"
              :alt="firstImage.alt"
              width="260"
              height="325"
              densities="x1 x2"
              format="webp"
              class="size-full object-cover"
            />
          </div>
          <div
            v-if="secondImage"
            v-parallax="0.05"
            class="photo-frame absolute right-[6%] bottom-[8%] aspect-[4/5] w-[48%] rotate-3"
          >
            <NuxtImg
              :src="secondImage.src"
              :alt="secondImage.alt"
              width="260"
              height="325"
              densities="x1 x2"
              format="webp"
              class="size-full object-cover"
            />
          </div>
        </div>
      </template>
    </PageHero>

    <!-- Key facts -->
    <section class="py-12 sm:py-16">
      <UContainer class="max-w-7xl">
        <ul class="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          <Motion
            v-for="(stat, index) in page.stats"
            :key="stat.label"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.08 * index }"
            :in-view-options="{ once: true }"
            class="glass-warm rounded-2xl p-6"
          >
            <p class="text-gradient-brand font-heading text-4xl font-bold sm:text-5xl">
              {{ stat.value }}
            </p>
            <p class="mt-2 text-sm text-muted">
              {{ stat.label }}
            </p>
          </Motion>
        </ul>
      </UContainer>
    </section>

    <!-- Story -->
    <section class="py-16 sm:py-24">
      <UContainer class="max-w-7xl grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <SectionHeading
          title="Why we built Mentora"
          class="lg:sticky lg:top-28"
        />
        <Motion
          :initial="{ y: 24, opacity: 0 }"
          :while-in-view="{ y: 0, opacity: 1 }"
          :transition="{ duration: 0.6, delay: 0.1 }"
          :in-view-options="{ once: true }"
          class="prose-mentora text-lg leading-relaxed text-muted"
        >
          <MDC :value="page.content" />
        </Motion>
      </UContainer>
    </section>

    <!-- Values -->
    <section class="py-16 sm:py-24">
      <UContainer class="max-w-7xl">
        <SectionHeading
          title="What we stand for"
          description="The promises behind every lesson on Mentora."
          :highlight="2"
          align="center"
        />
        <ul class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Motion
            v-for="(value, index) in page.values"
            :key="value.title"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.08 * index }"
            :in-view-options="{ once: true }"
            data-testid="about-value"
            class="glass-warm flex flex-col gap-4 rounded-2xl p-6 transition hover:-translate-y-1"
          >
            <span class="flex size-11 items-center justify-center rounded-full bg-mentora-500/10 text-mentora-400 ring-1 ring-mentora-500/40">
              <UIcon
                :name="value.icon"
                class="size-5"
                aria-hidden="true"
              />
            </span>
            <h3 class="font-heading text-xl font-semibold text-highlighted">
              {{ value.title }}
            </h3>
            <p class="text-sm leading-relaxed text-muted">
              {{ value.description }}
            </p>
          </Motion>
        </ul>
      </UContainer>
    </section>

    <LandingCTA
      v-if="home"
      :page="home"
    />
  </UPage>
</template>
