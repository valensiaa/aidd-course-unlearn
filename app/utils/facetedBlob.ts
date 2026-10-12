// Low-poly ("faceted") blob helpers: a ring-based triangle mesh that gets
// shaded per facet with a fake 3D dome and a single light source.

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface MeshRing {
  /** Distance from the centre as a fraction of the outline (0 = centre point). */
  frac: number
  count: number
}

export interface MeshVertex {
  ring: number
  angle: number
  frac: number
  /** Per-vertex random phase, used to make facets shimmer independently. */
  phase: number
}

export interface FacetMesh {
  vertices: MeshVertex[]
  triangles: [number, number, number][]
}

export interface Facet {
  points: string
  fill: string
  /** Fill tinted toward the edge color: one stroke that both hides seams and draws a light edge. */
  stroke: string
  opacity: number
}

export interface FacetShading {
  opacity?: (intensity: number) => number
  /** Color the facet edges lean toward, and by how much (0 = edges match the fill). */
  edge?: { color: string, amount: number }
}

export type ColorStop = [offset: number, hex: string]

// Deterministic PRNG so server and client render the same mesh
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Triangulate the band between two rings whose vertices are ordered by angle
function stitchRings(inner: number[], outer: number[], closed: boolean) {
  const triangles: [number, number, number][] = []
  const endI = closed ? inner.length : inner.length - 1
  const endJ = closed ? outer.length : outer.length - 1
  const at = (ring: number[], index: number) => ring[index % ring.length]!

  if (inner.length === 1) {
    for (let j = 0; j < endJ; j++) triangles.push([inner[0]!, at(outer, j + 1), at(outer, j)])
    return triangles
  }

  let i = 0
  let j = 0
  while (i < endI || j < endJ) {
    const advanceInner = j >= endJ || (i < endI && (i + 1) / endI <= (j + 1) / endJ)
    if (advanceInner) {
      triangles.push([at(inner, i), at(inner, i + 1), at(outer, j)])
      i++
    } else {
      triangles.push([at(inner, i), at(outer, j + 1), at(outer, j)])
      j++
    }
  }
  return triangles
}

/**
 * Build a ring mesh. Without `arc` the rings are closed loops around the centre;
 * with `arc` they span [start, end] radians and keep their end vertices on the arc edges.
 */
export function buildFacetMesh(rings: MeshRing[], seed: number, arc?: { start: number, end: number }): FacetMesh {
  const random = seeded(seed)
  const vertices: MeshVertex[] = []
  const ringIndices: number[][] = []

  rings.forEach((ring, r) => {
    const indices: number[] = []
    const isOuter = r === rings.length - 1
    const step = arc ? (arc.end - arc.start) / Math.max(ring.count - 1, 1) : (Math.PI * 2) / ring.count
    const offset = arc ? 0 : (random() - 0.5) * step * 0.5

    for (let k = 0; k < ring.count; k++) {
      const isEdge = arc && (k === 0 || k === ring.count - 1)
      const jitter = ring.count === 1 || isEdge ? 0 : (random() - 0.5) * step * 0.6
      const angle = (arc ? arc.start : 0) + k * step + offset + jitter
      const frac = ring.frac === 0 || isOuter ? ring.frac : ring.frac * (1 + (random() - 0.5) * 0.12)
      indices.push(vertices.length)
      vertices.push({ ring: r, angle, frac, phase: random() * Math.PI * 2 })
    }
    ringIndices.push(indices)
  })

  const triangles = ringIndices.slice(1).flatMap((outer, r) => stitchRings(ringIndices[r]!, outer, !arc))
  return { vertices, triangles }
}

function parseHex(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const
}

function sampleStops(stops: ColorStop[], t: number) {
  const clamped = Math.min(Math.max(t, 0), 1)
  const upper = stops.findIndex(([offset]) => offset >= clamped)
  if (upper <= 0) return parseHex(stops[Math.max(upper, 0)]![1])
  const [o0, c0] = stops[upper - 1]!
  const [o1, c1] = stops[upper]!
  const mix = (clamped - o0) / (o1 - o0 || 1)
  const a = parseHex(c0)
  const b = parseHex(c1)
  return a.map((channel, i) => Math.round(channel + (b[i]! - channel) * mix)) as unknown as readonly [number, number, number]
}

const round = (n: number) => Math.round(n * 10) / 10

/** Flat-shade each triangle: brighter the more its normal faces the light. */
export function shadeFacets(mesh: FacetMesh, positions: Vec3[], light: Vec3, stops: ColorStop[], { opacity = () => 1, edge }: FacetShading = {}): Facet[] {
  const edgeColor = edge ? parseHex(edge.color) : undefined
  const length = Math.hypot(light.x, light.y, light.z)
  const l = { x: light.x / length, y: light.y / length, z: light.z / length }

  return mesh.triangles.map(([ia, ib, ic]) => {
    const a = positions[ia]!
    const b = positions[ib]!
    const c = positions[ic]!
    const u = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z }
    const v = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z }
    let n = { x: u.y * v.z - u.z * v.y, y: u.z * v.x - u.x * v.z, z: u.x * v.y - u.y * v.x }
    if (n.z < 0) n = { x: -n.x, y: -n.y, z: -n.z }
    const nLength = Math.hypot(n.x, n.y, n.z) || 1
    const intensity = Math.max(0, (n.x * l.x + n.y * l.y + n.z * l.z) / nLength)
    const color = sampleStops(stops, intensity)
    const edgeMix = edgeColor ? color.map((channel, i) => Math.round(channel + (edgeColor[i]! - channel) * edge!.amount)) : color

    return {
      points: `${round(a.x)},${round(a.y)} ${round(b.x)},${round(b.y)} ${round(c.x)},${round(c.y)}`,
      fill: `rgb(${color.join(' ')})`,
      stroke: `rgb(${edgeMix.join(' ')})`,
      opacity: opacity(intensity)
    }
  })
}

/** Rounded polygon points string, e.g. for an outline or glow behind the facets. */
export function toPoints(positions: Vec3[]) {
  return positions.map(p => `${round(p.x)},${round(p.y)}`).join(' ')
}

/**
 * Push a polyline outward by `gap`, keeping edges parallel (miter offset).
 * Outward is to the left of travel in screen coordinates, i.e. vertices ordered clockwise on screen.
 * Open lines offset their end points along their single edge only.
 */
export function offsetOutline(points: Vec3[], gap: number, closed = true): Vec3[] {
  const normal = (a: Vec3, b: Vec3) => {
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
    return { x: (b.y - a.y) / length, y: (a.x - b.x) / length }
  }

  const count = points.length

  return points.map((point, i) => {
    const before = closed || i > 0 ? normal(points[(i - 1 + count) % count]!, point) : undefined
    const after = closed || i < count - 1 ? normal(point, points[(i + 1) % count]!) : undefined
    const n1 = (before ?? after)!
    const n2 = (after ?? before)!
    const mx = n1.x + n2.x
    const my = n1.y + n2.y
    const length = Math.hypot(mx, my) || 1
    const miter = gap / Math.max((mx / length) * n1.x + (my / length) * n1.y, 0.5)
    return { x: point.x + (mx / length) * miter, y: point.y + (my / length) * miter, z: 0 }
  })
}
