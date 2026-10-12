/**
 * How many viewBox units one screen pixel covers for an SVG that scales with its
 * container (fit inside, keeping its aspect ratio). Updates when the SVG resizes.
 */
export function useSvgUnitsPerPx(svg: Readonly<Ref<SVGSVGElement | null>>, viewBox: { width: number, height: number }, initialWidth: number) {
  const unitsPerPx = ref(viewBox.width / initialWidth)
  let resizeObserver: ResizeObserver | undefined

  onMounted(() => {
    resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry?.contentRect ?? {}
      if (width && height) unitsPerPx.value = Math.max(viewBox.width / width, viewBox.height / height)
    })
    if (svg.value) resizeObserver.observe(svg.value)
  })

  onBeforeUnmount(() => resizeObserver?.disconnect())

  return unitsPerPx
}
