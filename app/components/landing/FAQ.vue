<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

// Last word of the title gets the brand gradient, like the other sections
const titleParts = computed(() => highlightTitle(props.page.faq.title))

const categories = computed(() => props.page.faq.categories)
const active = ref(0)

const tabs = useTemplateRef<HTMLButtonElement[]>('tabs')

// Arrow keys move between the category tabs (WAI-ARIA tabs pattern; Up/Down work too)
function onTabKeydown(event: KeyboardEvent) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
  if (!step) return
  event.preventDefault()
  const count = categories.value.length
  active.value = (active.value + step + count) % count
  tabs.value?.[active.value]?.focus()
}
</script>

<template>
  <section
    id="faq"
    class="relative isolate overflow-hidden py-20 sm:py-28"
  >
    <UContainer class="max-w-7xl grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
      <!-- Heading -->
      <Motion
        :initial="{ y: 24, opacity: 0 }"
        :while-in-view="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6 }"
        :in-view-options="{ once: true }"
      >
        <h2 class="text-3xl font-bold leading-tight tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
          {{ titleParts.lead }} <span class="text-gradient-brand">{{ titleParts.highlight }}</span>
        </h2>
        <p class="mt-5 max-w-md text-lg leading-relaxed text-muted">
          {{ page.faq.description }}
        </p>
      </Motion>

      <!-- Category tabs above the questions of the active category -->
      <div class="relative">
        <!-- Blob from the middle of the list outwards, covering its right half; it shows
             through the glass -->
        <BlobBackdrop
          v-parallax="0.1"
          variant="ember"
          class="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[42rem] -translate-y-1/2 opacity-90 max-lg:hidden"
        />

        <div
          role="tablist"
          aria-label="Question categories"
          class="flex flex-wrap gap-3"
        >
          <button
            v-for="(category, index) in categories"
            :id="`faq-tab-${index}`"
            ref="tabs"
            :key="category.title"
            type="button"
            role="tab"
            data-testid="faq-tab"
            :aria-selected="active === index"
            :aria-controls="`faq-panel-${index}`"
            :tabindex="active === index ? 0 : -1"
            class="cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mentora-400"
            :class="active === index
              ? 'bg-gradient-brand btn-glow text-white'
              : 'text-muted ring-1 ring-default hover:text-highlighted hover:ring-mentora-500/40'"
            @click="active = index"
            @keydown="onTabKeydown"
          >
            {{ category.title }}
          </button>
        </div>

        <Transition
          mode="out-in"
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 translate-y-2"
          leave-active-class="transition duration-200"
          leave-to-class="opacity-0"
        >
          <div
            :id="`faq-panel-${active}`"
            :key="active"
            role="tabpanel"
            data-testid="faq-panel"
            :aria-labelledby="`faq-tab-${active}`"
            class="mt-6"
          >
            <UAccordion
              trailing-icon="i-lucide-plus"
              :items="categories[active]?.questions"
              :unmount-on-hide="false"
              :ui="{
                root: 'flex flex-col gap-3',
                item: 'glass-warm rounded-2xl border-none',
                trigger: 'group px-6 py-5 font-heading text-base font-medium text-highlighted sm:text-lg cursor-pointer',
                trailingIcon: 'size-5 text-mentora-400 transition-transform duration-300 group-data-[state=open]:rotate-135',
                body: 'px-6 pb-6 pt-0 text-highlighted leading-relaxed'
              }"
            >
              <template #default="{ item }">
                <span data-testid="faq-question">{{ item.label }}</span>
              </template>
              <template #body="{ item }">
                <div data-testid="faq-answer">
                  <MDC
                    :value="item.content"
                    unwrap="p"
                  />
                </div>
              </template>
            </UAccordion>
          </div>
        </Transition>
      </div>
    </UContainer>
  </section>
</template>
