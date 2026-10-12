/**
 * Animation time (seconds) for the hero blobs. Runs faster while `fast` is true,
 * easing between speeds so the motion never jumps. Stays at 0 for reduced motion.
 */
export function useBlobClock(fast: MaybeRefOrGetter<boolean | undefined>, fastSpeed = 3) {
  const time = ref(0)
  let frame = 0
  let last = 0
  let speed = 1

  const tick = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
    last = now
    frame = requestAnimationFrame(tick)
    // Hold still during the theme reveal: a changing page forces the browser to
    // repaint the whole revealed snapshot every frame, which makes the reveal stutter
    if (document.documentElement.classList.contains('theme-switching')) return
    const target = toValue(fast) ? fastSpeed : 1
    speed += (target - speed) * (1 - Math.exp(-dt * 3))
    time.value += dt * speed
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    frame = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => cancelAnimationFrame(frame))

  return time
}
