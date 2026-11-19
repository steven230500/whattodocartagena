import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import type { RawCity } from "@/features/city3d/domain/city-model"
import { StreetGraph } from "@/features/city3d/domain/street-graph"
import { decodeCity } from "@/features/city3d/infrastructure/load-city"

describe("datos reales public/3d/cartagena.json", () => {
  const raw = JSON.parse(
    readFileSync(resolve(process.cwd(), "public/3d/cartagena.json"), "utf8"),
  ) as RawCity
  const city = decodeCity(raw)

  it("contiene más de 3000 edificios válidos con height > 0 y anillo exterior de al menos 3 puntos", () => {
    expect(city.buildings.length).toBeGreaterThan(3000)
    for (const b of city.buildings) {
      expect(b.height).toBeGreaterThan(0)
      expect(b.rings.length).toBeGreaterThanOrEqual(1)
      expect(b.rings[0].length).toBeGreaterThanOrEqual(6)
    }
  })

  it("incluye los barrios Centro, Getsemaní y San Diego", () => {
    const names = new Set(city.barrios.map((b) => b.name))
    expect(names.has("Centro")).toBe(true)
    expect(names.has("Getsemaní")).toBe(true)
    expect(names.has("San Diego")).toBe(true)
  })

  it("tiene un grafo de calles con aristas que apuntan a nodos válidos", () => {
    const nodeCount = city.graph.nodes.length / 2
    expect(nodeCount).toBeGreaterThan(0)
    expect(city.graph.edges.length).toBeGreaterThan(0)
    expect(city.graph.edges.length % 2).toBe(0)

    for (let i = 0; i < city.graph.edges.length; i++) {
      expect(city.graph.edges[i]).toBeLessThan(nodeCount)
    }
  })

  it("traza una ruta por calles entre la Puerta del Reloj y la Catedral de largo entre 150 y 800 m", () => {
    const graph = new StreetGraph(city.graph.nodes, city.graph.edges)
    const route = graph.routeThrough([
      [-350, -52],
      [-510, 23],
    ])

    expect(route.points.length).toBeGreaterThan(4)
    expect(route.length).toBeGreaterThanOrEqual(150)
    expect(route.length).toBeLessThanOrEqual(800)
  })
})
