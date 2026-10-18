<script setup lang="ts">
// Hero photo that doubles as a video poster. The play button opens a 16:9 player over
// the hero, revealed with the same growing circle as the theme toggle from where it was
// clicked; closing shrinks it back. The stage plays the hero background animation for now.
const playButton = useTemplateRef<HTMLButtonElement>('playButton')
const stage = useTemplateRef<HTMLDivElement>('stage')
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')

const open = ref(false)
const stageHovered = ref(false)
const reducedMotion = usePreferredReducedMotion()
const scrollLocked = useScrollLock(() => import.meta.client ? document.body : null)

let origin = { x: 0, y: 0 }
let animating = false

// Only the stage is revealed, so the hero stays visible around it
function reveal(direction: 'normal' | 'reverse') {
  if (!stage.value || reducedMotion.value === 'reduce') return Promise.resolve()
  const rect = stage.value.getBoundingClientRect()
  const keyframes = circleRevealKeyframes(origin.x - rect.left, origin.y - rect.top, rect.width, rect.height)
  // `forwards` keeps the stage fully clipped after closing until it unmounts
  return stage.value.animate(keyframes, { ...CIRCLE_REVEAL_TIMING, direction, fill: 'forwards' }).finished.catch(() => {})
}

async function openPlayer(event: MouseEvent) {
  if (open.value || animating || !playButton.value) return

  const rect = playButton.value.getBoundingClientRect()
  // Keyboard activation has no pointer position: grow from the button's centre
  origin = event.detail > 0
    ? { x: event.clientX, y: event.clientY }
    : { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

  animating = true
  open.value = true
  scrollLocked.value = true
  await nextTick()
  closeButton.value?.focus({ preventScroll: true })
  await reveal('normal')
  animating = false
}

async function closePlayer() {
  if (!open.value || animating) return

  animating = true
  await reveal('reverse')
  open.value = false
  scrollLocked.value = false
  animating = false
  playButton.value?.focus({ preventScroll: true })
}

onKeyStroke('Escape', () => closePlayer())

// The close button is the only control in the player: keep Tab focus on it
function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return
  event.preventDefault()
  closeButton.value?.focus()
}
</script>

<template>
  <div class="photo-frame aspect-[9/8]">
    <!-- poster -->
    <slot />

    <button
      ref="playButton"
      type="button"
      aria-label="Play video"
      aria-haspopup="dialog"
      class="bg-gradient-brand btn-glow absolute inset-0 z-10 m-auto grid size-20 cursor-pointer place-items-center rounded-full text-white transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      @click="openPlayer"
    >
      <!-- solid play triangle (the icon font's play glyph is outline-only) -->
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        class="size-8 translate-x-0.5"
      >
        <path
          d="M7 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z"
          fill="currentColor"
        />
      </svg>
    </button>

    <Teleport to="body">
      <!-- Transparent backdrop: the hero stays visible around the player; clicking it closes -->
      <div
        v-if="open"
        role="dialog"
        aria-modal="true"
        aria-label="Mentora video"
        class="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-10"
        @click.self="closePlayer"
        @keydown="trapFocus"
      >
        <!-- 16:9 stage, as large as fits the screen. Stand-in for the video: the hero
             background animation laid out like the 1920×1080 desktop background -->
        <div
          ref="stage"
          class="relative aspect-video w-[min(72rem,100%,calc((100dvh-5rem)*16/9))] overflow-hidden rounded-2xl bg-midnight-950 ring-1 ring-white/10"
          @mouseenter="stageHovered = true"
          @mouseleave="stageHovered = false"
        >
          <LandingHeroCornerBlob
            :fast="stageHovered"
            class="pointer-events-none absolute top-[60.2%] left-0 h-[31.5%] w-[26.6%] opacity-80 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
          />
          <BlobBackdrop
            variant="hero"
            :fast="stageHovered"
            class="pointer-events-none absolute top-[7.3%] left-[47.3%] h-[62.6%] w-[37.1%]"
          />

          <button
            ref="closeButton"
            type="button"
            aria-label="Close video"
            class="absolute top-3 right-3 z-10 grid size-11 cursor-pointer place-items-center rounded-full text-white ring-1 ring-white/25 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            @click="closePlayer"
          >
            <UIcon
              name="i-lucide-x"
              class="size-5"
            />
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
