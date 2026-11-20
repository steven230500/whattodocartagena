import type { LatLng, Projection } from "./projection"
import type { StreetGraph } from "./street-graph"

export interface WalkingRoute {
  /** el camino por calles, incluidas las paradas */
  path: LatLng[]
  meters: number
}

/** Ritmo de paseo turístico (≈4,5 km/h), no de quien va con prisa. */
const METERS_PER_MINUTE = 75

/** Traza el recorrido a pie por las paradas en orden, siguiendo calles reales. */
export function traceWalkingRoute(graph: StreetGraph, projection: Projection, stops: LatLng[]): WalkingRoute {
  const res = graph.routeThrough(stops.map((s) => projection.toLocal(s)))
  const path: LatLng[] = []
  for (let i = 0; i < res.points.length; i += 2) path.push(projection.toLatLng(res.points[i], res.points[i + 1]))
  return { path, meters: res.length }
}

export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / METERS_PER_MINUTE))
}
