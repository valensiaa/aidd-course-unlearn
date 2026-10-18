import type { Directive } from 'vue'

// `v-parallax="speed"`: the element drifts against the scroll for a subtle sense of depth.
// Positive speeds lag behind the page (background layers, e.g. blobs), negative speeds run
// slightly ahead (foreground, e.g. photos). Typical values: 0.04–0.15.
//
// It writes `transform` only, so it combines with Tailwind's `translate`/`rotate`/`scale`
// utilities (separate CSS properties in v4). Don't put it on an element that animates its own
// `transform`, such as a <Motion> wrapper.

const MAX_OFFSET = 60

declare module 'vue' {
  interface GlobalDirectives {
    vParallax: Directive<HTMLElement, number | undefined>
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('parallax', { getSSRProps: () => ({}) })
    return
  }

  const speeds = new Map<HTMLElement, number>()
  const applied = new Map<HTMLElement, number>()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let frame = 0

  function update() {
    frame = 0
    const viewportHeight = window.innerHeight
    const viewportMiddle = viewportHeight / 2
    // A handful of elements per page, so measuring each one is cheap
    for (const [el, speed] of speeds) {
      const rect = el.getBoundingClientRect()
      // Leave elements far off-screen alone
      if (rect.bottom < -200 || rect.top > viewportHeight + 200) continue
      // Measure where the element would be without its current offset, so offsets don't compound
      const middle = rect.top + rect.height / 2 - (applied.get(el) ?? 0)
      const raw = (viewportMiddle - middle) * speed
      const offset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, raw))
      applied.set(el, offset)
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
    }
  }

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('parallax', {
    mounted(el, binding) {
      if (reducedMotion) return
      speeds.set(el, binding.value ?? 0.1)
      schedule()
    },
    updated(el, binding) {
      if (speeds.has(el)) speeds.set(el, binding.value ?? 0.1)
    },
    unmounted(el) {
      speeds.delete(el)
      applied.delete(el)
    }
  })
})
