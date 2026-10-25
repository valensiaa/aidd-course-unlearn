<script setup lang="ts">
// Animated faceted blob to sit behind an image. It drifts, turns and reshapes within a few
// percent of its spot, its facets catch the light as it moves, and an optional outline
// follows it 10px outside its edge. Variants live in utils/blobVariants.ts.
//
// Usage: make the image's wrapper `relative` and place the blob behind it, a bit larger:
//   <div class="relative">
//     <BlobBackdrop variant="shard" class="pointer-events-none absolute -inset-[15%] -z-10" />
//     <img ...>
//   </div>
// For cut-out photos of people, use <BlobPortrait>, which handles that layout.
const props = withDefaults(defineProps<{
  variant?: BlobVariantName
  /** Speed the motion up, e.g. while the image is hovered */
  fast?: boolean
  /** Ease to a stop and hold still, e.g. in a grid of cards until one is hovered */
  paused?: boolean
  outline?: boolean
}>(), {
  variant: 'ember',
  outline: true
})

const id = useId()
const time = useBlobClock(() => props.fast, () => props.paused)

// Gap between the blob and its outline, in screen pixels
const OUTLINE_GAP_PX = 10

const config = computed<BlobVariant>(() => BLOB_VARIANTS[props.variant])
const mesh = computed(() => buildFacetMesh(config.value.rings, config.value.seed))

const svg = useTemplateRef<SVGSVGElement>('svg')
const unitsPerPx = useSvgUnitsPerPx(svg, config.value.viewBox, 600)

const wave = (t: number, period: number, offset = 0) => Math.sin((t / period) * Math.PI * 2 + offset)
const dome = (r: number) => Math.sqrt(Math.max(0, 1 - r ** 2))

// Outline radius at an angle; the phases drift slowly so the shape morphs
function outlineRadius(angle: number, t: number) {
  return config.value.harmonics.reduce(
    (r, { k, amp, phase, wobble, period, offset }) => r + amp * Math.sin(k * angle + phase + wobble * wave(t, period, offset)),
    1
  )
}

const frame = computed(() => {
  const t = time.value
  const { center, radius, light, stops, edge, height = dome } = config.value
  const outerRing = config.value.rings.length - 1

  const positions = mesh.value.vertices.map((vertex) => {
    const angle = vertex.angle + 0.03 * wave(t, 8, vertex.phase)
    const r = vertex.frac * outlineRadius(angle, t)
    // Surface height, nudged per vertex so facets shimmer
    const z = height(Math.min(r, 1)) * 300 * (1 + 0.1 * wave(t, 6, vertex.phase)) + 20
    return { x: center.x + radius.x * r * Math.cos(angle), y: center.y + radius.y * r * Math.sin(angle), z }
  })

  const outer = mesh.value.vertices.flatMap((vertex, index) => vertex.ring === outerRing ? [positions[index]!] : [])

  const dx = 16 * (0.8 * wave(t, 26) + 0.3 * wave(t, 11, 1))
  const dy = 14 * (0.8 * wave(t, 22, 2) + 0.3 * wave(t, 13, 3))
  const rotate = 2.5 * wave(t, 19)
  const scale = 1 + 0.015 * (1 + wave(t, 19, 1.2))

  return {
    facets: shadeFacets(mesh.value, positions, light, stops, { edge }),
    transform: `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${rotate.toFixed(2)} ${center.x} ${center.y}) translate(${center.x} ${center.y}) scale(${scale.toFixed(4)}) translate(${-center.x} ${-center.y})`,
    // Divide out the group scale so the gap stays 10px while the blob breathes
    offsetOutline: props.outline ? toPoints(offsetOutline(outer, (OUTLINE_GAP_PX * unitsPerPx.value) / scale)) : '',
    offsetOpacity: (0.85 + 0.15 * wave(t, 23, 2.5)).toFixed(2)
  }
})
</script>

<template>
  <div
    aria-hidden="true"
    data-testid="blob-backdrop"
    class="will-change-transform"
  >
    <!-- will-change gives the blob its own compositing layer: repainting it each frame then
         leaves whatever is in front of it cached instead of repainting it too. Keep this a
         single root element (no comment above it), so directives like v-parallax apply. -->
    <svg
      ref="svg"
      :viewBox="`0 0 ${config.viewBox.width} ${config.viewBox.height}`"
      fill="none"
      class="size-full overflow-visible"
    >
      <defs>
        <linearGradient
          :id="`${id}-ring`"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0"
            stop-color="#F6512F"
            stop-opacity="0.9"
          />
          <stop
            offset="1"
            stop-color="#F6512F"
            stop-opacity="0.2"
          />
        </linearGradient>
      </defs>
      <g :transform="frame.transform">
        <!-- facets; the slightly lighter stroke hides seams and draws the facet edges -->
        <polygon
          v-for="(facet, index) in frame.facets"
          :key="index"
          :points="facet.points"
          :fill="facet.fill"
          :stroke="facet.stroke"
          stroke-width="1"
          stroke-linejoin="round"
        />
        <!-- outline that follows the blob's shape at a fixed gap -->
        <polygon
          v-if="outline"
          :points="frame.offsetOutline"
          :opacity="frame.offsetOpacity"
          :stroke="`url(#${id}-ring)`"
          stroke-width="1.5"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </g>
    </svg>
  </div>
</template>
