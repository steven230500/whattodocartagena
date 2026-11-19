import type { CityModel, RawCity, Ring } from "../domain/city-model"

export const CITY_MODEL_URL = "/3d/cartagena.json"

let cached: Promise<CityModel> | null = null

/** Descarga y decodifica el modelo una sola vez por sesión. */
export function loadCity(url = CITY_MODEL_URL): Promise<CityModel> {
  if (!cached) {
    cached = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`No se pudo cargar el modelo 3D (${r.status})`)
        return r.json() as Promise<RawCity>
      })
      .then(decodeCity)
      .catch((e) => {
        cached = null
        throw e
      })
  }
  return cached
}

export function decodeCity(raw: RawCity): CityModel {
  const s = raw.scale
  const ring = (a: number[]): Ring => {
    const out = new Float32Array(a.length)
    for (let i = 0; i < a.length; i++) out[i] = a[i] * s
    return out
  }
  const [minX, minY, maxX, maxY] = raw.bounds.map((v) => v * s)
  return {
    attribution: raw.attribution,
    origin: raw.origin,
    bounds: { minX, minY, maxX, maxY },
    barrios: raw.barrios.map((b) => ({ name: b.n, ring: ring(b.p), center: [b.c[0] * s, b.c[1] * s] })),
    land: raw.land.map(ring),
    water: raw.water.map(ring),
    green: raw.green.map(ring),
    plazas: raw.plazas.map(ring),
    walls: raw.walls.map((w) => ({ name: w.n, points: ring(w.p) })),
    streets: raw.streets.map((st) => ({ width: st.w, points: ring(st.p) })),
    graph: { nodes: ring(raw.graph.n), edges: Uint32Array.from(raw.graph.e) },
    buildings: raw.buildings.map((b) => ({
      rings: b.p.map(ring),
      height: b.h,
      facade: b.f,
      roof: b.r,
      barrio: b.b,
      name: b.n,
      landmark: b.lm,
    })),
    landmarks: raw.landmarks.map((l) => ({ name: l.n, kind: l.k, x: l.x * s, y: l.y * s })),
  }
}
