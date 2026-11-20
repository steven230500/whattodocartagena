import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { createProjection } from "@/features/city3d/domain/projection"
import { StreetGraph } from "@/features/city3d/domain/street-graph"
import { traceWalkingRoute, walkingMinutes } from "@/features/city3d/domain/walking-route"
import { createStreetRouter, type RawStreets } from "@/features/city3d/infrastructure/load-streets"

const haversine = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371000
  const r = (d: number) => (d * Math.PI) / 180
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

describe("traceWalkingRoute", () => {
  it("rodea la manzana por la calle en vez de cortar en diagonal", () => {
    const origin = { lat: 10.4, lng: -75.5 }
    const proj = createProjection(origin)
    // calles en L: (0,0) → (100,0) → (100,100)
    const graph = new StreetGraph(new Float32Array([0, 0, 100, 0, 100, 100]), new Uint32Array([0, 1, 1, 2]))
    const a = proj.toLatLng(0, 0)
    const b = proj.toLatLng(100, 100)
    const r = traceWalkingRoute(graph, proj, [a, b])
    expect(r.meters).toBeCloseTo(200, 0)
    expect(r.path).toHaveLength(3)
    expect(r.path[0].lat).toBeCloseTo(a.lat, 6)
    expect(r.path[2].lng).toBeCloseTo(b.lng, 6)
  })
})

describe("walkingMinutes", () => {
  it("usa ritmo de paseo y nunca da cero", () => {
    expect(walkingMinutes(0)).toBe(1)
    expect(walkingMinutes(750)).toBe(10)
    expect(walkingMinutes(3200)).toBe(43)
  })
})

describe("public/3d/streets.json", () => {
  const raw = JSON.parse(readFileSync(resolve(process.cwd(), "public/3d/streets.json"), "utf8")) as RawStreets
  const router = createStreetRouter(raw)

  it("traza Torre del Reloj → Santo Domingo → Catedral por calles, más largo que la línea recta pero sin rodeos absurdos", () => {
    const stops = [
      { lat: 10.42302, lng: -75.54921 },
      { lat: 10.42435, lng: -75.55198 },
      { lat: 10.42371, lng: -75.55066 },
    ]
    const straight = haversine(stops[0], stops[1]) + haversine(stops[1], stops[2])
    const r = router.route(stops)
    expect(r.path.length).toBeGreaterThan(stops.length + 3)
    expect(r.meters).toBeGreaterThan(straight)
    expect(r.meters).toBeLessThan(straight * 1.8)
    // la distancia en metros locales coincide con la real
    let real = 0
    for (let i = 1; i < r.path.length; i++) real += haversine(r.path[i - 1], r.path[i])
    expect(Math.abs(real - r.meters) / real).toBeLessThan(0.01)
  })
})
