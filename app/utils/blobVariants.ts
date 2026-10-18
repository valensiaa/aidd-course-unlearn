// Presets for <BlobBackdrop>: faceted blobs in the Mentora palette, all animated the same way
// (drift, turn, breathe, morph) but with their own shape, facet density, light and colors.

/** One term of the outline: amp · sin(k·angle + phase + wobble · wave(t, period, offset)). */
export interface OutlineHarmonic {
  k: number
  amp: number
  phase: number
  wobble: number
  period: number
  offset: number
}

export interface BlobVariant {
  viewBox: { width: number, height: number }
  center: { x: number, y: number }
  radius: { x: number, y: number }
  rings: MeshRing[]
  seed: number
  harmonics: OutlineHarmonic[]
  light: Vec3
  stops: ColorStop[]
  edge: { color: string, amount: number }
  /** Surface height (0–1) at a fraction of the outline radius; shapes the facet shading. */
  height?: (r: number) => number
}

const harmonic = (k: number, amp: number, phase: number, wobble: number, period: number, offset: number): OutlineHarmonic =>
  ({ k, amp, phase, wobble, period, offset })

const SQUARE = { viewBox: { width: 800, height: 800 }, center: { x: 400, y: 400 } }

const WARM_STOPS: ColorStop[] = [
  [0, '#6E0D05'],
  [0.35, '#B91105'],
  [0.55, '#E71407'],
  [0.72, '#F6512F'],
  [0.88, '#FA8468'],
  [1, '#FFC9B8']
]

export const BLOB_VARIANTS = {
  // The hero blob behind the photo (fitted to its 800×760 artwork)
  hero: {
    viewBox: { width: 800, height: 760 },
    center: { x: 420, y: 390 },
    radius: { x: 350, y: 330 },
    rings: [{ frac: 0, count: 1 }, { frac: 0.3, count: 7 }, { frac: 0.58, count: 12 }, { frac: 0.82, count: 16 }, { frac: 1, count: 20 }],
    seed: 7,
    harmonics: [harmonic(2, 0.07, 0.6, 0.5, 14, 0), harmonic(3, 0.05, 2.1, 0.6, 11, 1), harmonic(5, 0.03, 0.4, 0.8, 9, 2)],
    light: { x: -0.45, y: -0.55, z: 0.75 },
    stops: WARM_STOPS,
    edge: { color: '#FFD3C4', amount: 0.12 }
  },

  // Rounded pebble in the hero colors: the all-round default
  ember: {
    ...SQUARE,
    radius: { x: 330, y: 305 },
    rings: [{ frac: 0, count: 1 }, { frac: 0.32, count: 6 }, { frac: 0.6, count: 11 }, { frac: 0.84, count: 15 }, { frac: 1, count: 18 }],
    seed: 11,
    harmonics: [harmonic(2, 0.06, 1.2, 0.5, 15, 0), harmonic(3, 0.06, 0.3, 0.6, 12, 1), harmonic(4, 0.025, 2.5, 0.7, 10, 2)],
    light: { x: -0.5, y: -0.5, z: 0.75 },
    stops: WARM_STOPS,
    edge: { color: '#FFD3C4', amount: 0.12 }
  },

  // Crystal: few, large facets lit from the top right, brighter and crisper edges
  shard: {
    ...SQUARE,
    radius: { x: 320, y: 320 },
    rings: [{ frac: 0, count: 1 }, { frac: 0.45, count: 5 }, { frac: 1, count: 9 }],
    seed: 3,
    harmonics: [harmonic(3, 0.1, 0.2, 0.4, 18, 0), harmonic(2, 0.04, 1.7, 0.5, 13, 1)],
    light: { x: 0.5, y: -0.6, z: 0.7 },
    stops: [[0, '#8A1206'], [0.3, '#D0230F'], [0.55, '#F6512F'], [0.75, '#FA8468'], [0.9, '#FDB09F'], [1, '#FFE5DD']],
    edge: { color: '#FFFFFF', amount: 0.18 }
  },

  // Five soft lobes in deeper reds
  bloom: {
    ...SQUARE,
    radius: { x: 315, y: 315 },
    rings: [{ frac: 0, count: 1 }, { frac: 0.3, count: 5 }, { frac: 0.58, count: 10 }, { frac: 0.82, count: 15 }, { frac: 1, count: 25 }],
    seed: 19,
    harmonics: [harmonic(5, 0.09, 0, 0.4, 16, 0), harmonic(2, 0.03, 0.8, 0.6, 12, 1)],
    light: { x: -0.3, y: -0.65, z: 0.7 },
    stops: [[0, '#49110A'], [0.3, '#86291D'], [0.5, '#C22C1A'], [0.7, '#E71407'], [0.85, '#F6512F'], [1, '#FA8468']],
    edge: { color: '#FDB09F', amount: 0.12 }
  },

  // Dark and muted like the corner blob: sits quietly behind bright or light images
  dusk: {
    ...SQUARE,
    radius: { x: 335, y: 310 },
    rings: [{ frac: 0, count: 1 }, { frac: 0.32, count: 6 }, { frac: 0.6, count: 11 }, { frac: 0.84, count: 15 }, { frac: 1, count: 19 }],
    seed: 29,
    harmonics: [harmonic(2, 0.08, 2.4, 0.5, 17, 0), harmonic(3, 0.04, 1, 0.6, 13, 1), harmonic(6, 0.02, 0.5, 0.8, 9, 2)],
    light: { x: -0.3, y: -0.7, z: 0.65 },
    stops: [[0, '#1E0704'], [0.4, '#49110A'], [0.62, '#86291D'], [0.8, '#C22C1A'], [1, '#F6512F']],
    edge: { color: '#FA8468', amount: 0.15 }
  },

  // Faceted ring with an open middle: frames round images such as avatars
  halo: {
    ...SQUARE,
    radius: { x: 330, y: 330 },
    rings: [{ frac: 0.56, count: 14 }, { frac: 0.78, count: 18 }, { frac: 1, count: 22 }],
    seed: 41,
    harmonics: [harmonic(2, 0.05, 0.4, 0.5, 15, 0), harmonic(3, 0.03, 1.9, 0.6, 11, 1)],
    light: { x: -0.45, y: -0.55, z: 0.75 },
    stops: WARM_STOPS,
    edge: { color: '#FFD3C4', amount: 0.12 },
    // Rounded tube: highest midway across the band
    height: r => Math.sqrt(Math.max(0, 1 - ((r - 0.78) / 0.26) ** 2))
  }
} satisfies Record<string, BlobVariant>

export type BlobVariantName = keyof typeof BLOB_VARIANTS

/** The variants made for backdrops behind images (the hero blob is fitted to the hero only) */
export const BACKDROP_BLOB_VARIANTS = ['ember', 'shard', 'bloom', 'dusk', 'halo'] as const satisfies BlobVariantName[]
