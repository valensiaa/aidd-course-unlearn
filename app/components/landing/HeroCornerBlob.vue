<script setup lang="ts">
// Faceted corner blob: breathes and reshapes while staying anchored to its corner
// (the viewBox's bottom-left, which the parent may rotate). An open outline follows its
// curved edge 10px outside, running off the cut edges. `fast` speeds it up.
const props = defineProps<{
  fast?: boolean
}>()

const id = useId()
const time = useBlobClock(() => props.fast)

// Gap between the blob and its outline, in screen pixels
const OUTLINE_GAP_PX = 10
const svg = useTemplateRef<SVGSVGElement>('svg')
const unitsPerPx = useSvgUnitsPerPx(svg, { width: 600, height: 400 }, 520)

const CORNER = { x: 0, y: 400, z: 0 }
const RADIUS = 355
const LIGHT = { x: -0.3, y: -0.7, z: 0.65 }
const STOPS: ColorStop[] = [
  [0, '#2A0905'],
  [0.4, '#49110A'],
  [0.62, '#86291D'],
  [0.8, '#C22C1A'],
  [1, '#F6512F']
]

const mesh = buildFacetMesh([
  { frac: 0, count: 1 },
  { frac: 0.38, count: 4 },
  { frac: 0.7, count: 6 },
  { frac: 1, count: 9 }
], 23, { start: -Math.PI / 2, end: 0 })

// Extend the line through `a` and `b` past `b` until it hits x = `x` (or y = `y`), so the
// outline runs right up to the blob's cut edges instead of stopping short of them
function extendTo(a: Vec3, b: Vec3, edge: { x: number } | { y: number }): Vec3 {
  const along = 'x' in edge ? (edge.x - a.x) / (b.x - a.x || 1e-6) : (edge.y - a.y) / (b.y - a.y || 1e-6)
  return { x: a.x + (b.x - a.x) * along, y: a.y + (b.y - a.y) * along, z: 0 }
}

const wave = (t: number, period: number, offset = 0) => Math.sin((t / period) * Math.PI * 2 + offset)

function outline(angle: number, t: number) {
  return 1
    + 0.04 * Math.sin(4 * angle + 0.8 + 0.7 * wave(t, 13))
    + 0.025 * Math.sin(7 * angle + 2.4 + 0.9 * wave(t, 10, 1.5))
}

const frame = computed(() => {
  const t = time.value

  const positions = mesh.vertices.map((vertex) => {
    const r = vertex.frac * outline(vertex.angle, t)
    const z = Math.sqrt(Math.max(0, 1 - Math.min(r, 1) ** 2)) * 280 * (1 + 0.12 * wave(t, 6, vertex.phase)) + 15
    return { x: CORNER.x + RADIUS * r * Math.cos(vertex.angle), y: CORNER.y + RADIUS * r * Math.sin(vertex.angle), z }
  })

  const outer = mesh.vertices.flatMap((vertex, index) => vertex.ring === 3 ? [positions[index]!] : [])
  const scale = 1 + 0.025 * (1 + wave(t, 17))
  const rotate = 1.5 * wave(t, 17, 0.8)

  // Open at both ends: the outer ring runs from the left edge (x = 0) to the bottom edge (y = 400)
  const offset = offsetOutline(outer, (OUTLINE_GAP_PX * unitsPerPx.value) / scale, false)
  if (offset.length > 1) {
    offset[0] = extendTo(offset[1]!, offset[0]!, { x: CORNER.x })
    offset[offset.length - 1] = extendTo(offset[offset.length - 2]!, offset[offset.length - 1]!, { y: CORNER.y })
  }

  return {
    facets: shadeFacets(mesh, positions, LIGHT, STOPS, { opacity: intensity => 0.45 + 0.5 * intensity }),
    rim: toPoints(outer),
    transform: `rotate(${rotate.toFixed(2)} ${CORNER.x} ${CORNER.y}) translate(${CORNER.x} ${CORNER.y}) scale(${scale.toFixed(4)}) translate(${-CORNER.x} ${-CORNER.y})`,
    rimOpacity: (0.85 + 0.15 * wave(t, 13, 2)).toFixed(2),
    offsetOutline: toPoints(offset),
    offsetOpacity: (0.85 + 0.15 * wave(t, 23, 2.5)).toFixed(2)
  }
})
</script>

<template>
  <!-- Own compositing layer: repainting the blob each frame then leaves the photo,
       its glow and blend overlay cached instead of repainting them too -->
  <div
    aria-hidden="true"
    class="will-change-transform"
  >
    <svg
      ref="svg"
      viewBox="0 0 600 400"
      fill="none"
      class="size-full overflow-visible"
    >
      <defs>
        <linearGradient
          :id="`${id}-rim`"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0"
            stop-color="#FA8468"
          />
          <stop
            offset="0.6"
            stop-color="#F6512F"
            stop-opacity="0.7"
          />
          <stop
            offset="1"
            stop-color="#F6512F"
            stop-opacity="0"
          />
        </linearGradient>
        <linearGradient
          :id="`${id}-line`"
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
        <!-- facets -->
        <polygon
          v-for="(facet, index) in frame.facets"
          :key="index"
          :points="facet.points"
          :fill="facet.fill"
          :fill-opacity="facet.opacity"
          stroke="#FA8468"
          stroke-opacity="0.1"
          stroke-width="1"
          stroke-linejoin="round"
        />
        <!-- rim along the curved edge -->
        <polyline
          :points="frame.rim"
          :stroke="`url(#${id}-rim)`"
          :opacity="frame.rimOpacity"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- open outline that follows the curved edge at a fixed gap -->
        <polyline
          :points="frame.offsetOutline"
          :opacity="frame.offsetOpacity"
          :stroke="`url(#${id}-line)`"
          stroke-width="1.5"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </g>
    </svg>
  </div>
</template>
