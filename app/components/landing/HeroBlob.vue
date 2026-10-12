<script setup lang="ts">
// Faceted (low-poly) hero blob: it drifts, turns and reshapes within a few percent
// of its resting spot, and the facets catch the light as it moves; an outline follows it
// 10px outside its edge. `fast` speeds it up.
const props = defineProps<{
  fast?: boolean
}>()

const id = useId()
const time = useBlobClock(() => props.fast)

// Gap between the blob and its outline, in screen pixels
const OUTLINE_GAP_PX = 10
const svg = useTemplateRef<SVGSVGElement>('svg')
const unitsPerPx = useSvgUnitsPerPx(svg, { width: 800, height: 760 }, 580)

const CENTER = { x: 420, y: 390 }
const RADIUS = { x: 350, y: 330 }
const LIGHT = { x: -0.45, y: -0.55, z: 0.75 }
const STOPS: ColorStop[] = [
  [0, '#6E0D05'],
  [0.35, '#B91105'],
  [0.55, '#E71407'],
  [0.72, '#F6512F'],
  [0.88, '#FA8468'],
  [1, '#FFC9B8']
]

const mesh = buildFacetMesh([
  { frac: 0, count: 1 },
  { frac: 0.3, count: 7 },
  { frac: 0.58, count: 12 },
  { frac: 0.82, count: 16 },
  { frac: 1, count: 20 }
], 7)

const wave = (t: number, period: number, offset = 0) => Math.sin((t / period) * Math.PI * 2 + offset)

// Blob outline radius at an angle; the phases drift slowly so the shape morphs
function outline(angle: number, t: number) {
  return 1
    + 0.07 * Math.sin(2 * angle + 0.6 + 0.5 * wave(t, 14))
    + 0.05 * Math.sin(3 * angle + 2.1 + 0.6 * wave(t, 11, 1))
    + 0.03 * Math.sin(5 * angle + 0.4 + 0.8 * wave(t, 9, 2))
}

const frame = computed(() => {
  const t = time.value

  const positions = mesh.vertices.map((vertex) => {
    const angle = vertex.angle + 0.03 * wave(t, 8, vertex.phase)
    const r = vertex.frac * outline(angle, t)
    // Dome height, nudged per vertex so facets shimmer
    const z = Math.sqrt(Math.max(0, 1 - Math.min(r, 1) ** 2)) * 300 * (1 + 0.1 * wave(t, 6, vertex.phase)) + 20
    return { x: CENTER.x + RADIUS.x * r * Math.cos(angle), y: CENTER.y + RADIUS.y * r * Math.sin(angle), z }
  })

  const outer = mesh.vertices.flatMap((vertex, index) => vertex.ring === 4 ? [positions[index]!] : [])

  const dx = 16 * (0.8 * wave(t, 26) + 0.3 * wave(t, 11, 1))
  const dy = 14 * (0.8 * wave(t, 22, 2) + 0.3 * wave(t, 13, 3))
  const rotate = 2.5 * wave(t, 19)
  const scale = 1 + 0.015 * (1 + wave(t, 19, 1.2))

  return {
    facets: shadeFacets(mesh, positions, LIGHT, STOPS, { edge: { color: '#FFD3C4', amount: 0.12 } }),
    transform: `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${rotate.toFixed(2)} ${CENTER.x} ${CENTER.y}) translate(${CENTER.x} ${CENTER.y}) scale(${scale.toFixed(4)}) translate(${-CENTER.x} ${-CENTER.y})`,
    // Divide out the group scale so the gap stays 10px while the blob breathes
    offsetOutline: toPoints(offsetOutline(outer, (OUTLINE_GAP_PX * unitsPerPx.value) / scale)),
    offsetOpacity: (0.85 + 0.15 * wave(t, 23, 2.5)).toFixed(2)
  }
})
</script>

<template>
  <!-- Own compositing layer: repainting the blob each frame then leaves the photo
       in front of it cached instead of repainting it too -->
  <div
    aria-hidden="true"
    class="will-change-transform"
  >
    <svg
      ref="svg"
      viewBox="0 0 800 760"
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
