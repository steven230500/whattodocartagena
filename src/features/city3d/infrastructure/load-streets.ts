import type { LatLng } from "../domain/projection"
import { createProjection } from "../domain/projection"
import { StreetGraph } from "../domain/street-graph"
import { traceWalkingRoute, type WalkingRoute } from "../domain/walking-route"

/** Solo el grafo peatonal (~36 KB gzip), sin el modelo 3D. Lo genera scripts/city3d/build.mjs. */
export const STREETS_URL = "/3d/streets.json"

export interface RawStreets {
  v: 1
  attribution: string
  origin: LatLng
  /** metros por unidad */
  scale: number
  graph: { n: number[]; e: number[] }
}

export interface StreetRouter {
  route(stops: LatLng[]): WalkingRoute
}

export function createStreetRouter(raw: RawStreets): StreetRouter {
  const nodes = new Float32Array(raw.graph.n.length)
  for (let i = 0; i < nodes.length; i++) nodes[i] = raw.graph.n[i] * raw.scale
  const graph = new StreetGraph(nodes, Uint32Array.from(raw.graph.e))
  const projection = createProjection(raw.origin)
  return { route: (stops) => traceWalkingRoute(graph, projection, stops) }
}

let cached: Promise<StreetRouter> | null = null

/** Descarga el grafo una vez por sesión; si falla, se puede reintentar. */
export function loadStreetRouter(url = STREETS_URL): Promise<StreetRouter> {
  if (!cached) {
    cached = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`No se pudo cargar el grafo de calles (${r.status})`)
        return r.json() as Promise<RawStreets>
      })
      .then(createStreetRouter)
      .catch((e) => {
        cached = null
        throw e
      })
  }
  return cached
}
