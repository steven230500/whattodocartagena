import { describe, expect, it } from "vitest"
import type { RawCity } from "@/features/city3d/domain/city-model"
import { decodeCity } from "@/features/city3d/infrastructure/load-city"

describe("decodeCity", () => {
  it("escala coordenadas de decímetros a metros y decodifica grafo, barrios y edificios", () => {
    const raw: RawCity = {
      v: 1,
      attribution: "© OpenStreetMap",
      origin: { lat: 10.4235, lng: -75.546 },
      scale: 0.1,
      bounds: [-1000, -500, 1000, 500],
      barrios: [
        {
          n: "Centro",
          p: [0, 0, 100, 0, 100, 100, 0, 100],
          c: [50, 50],
        },
      ],
      land: [[0, 0, 200, 0, 200, 200]],
      water: [[200, 0, 300, 0, 300, 200]],
      green: [[10, 10, 20, 10, 20, 20]],
      plazas: [[30, 30, 40, 30, 40, 40]],
      walls: [{ n: "Muralla", p: [0, 0, 100, 0] }],
      streets: [{ w: 6, p: [0, 50, 100, 50] }],
      graph: {
        n: [0, 50, 100, 50],
        e: [0, 1],
      },
      buildings: [
        {
          p: [[10, 10, 40, 10, 40, 40, 10, 40]],
          h: 12,
          f: 2,
          r: 1,
          b: 0,
          n: "Casa Colonial",
        },
      ],
      landmarks: [{ n: "Torre", x: 50, y: 50, k: "monument" }],
    }

    const city = decodeCity(raw)

    expect(city.attribution).toBe("© OpenStreetMap")
    expect(city.origin).toEqual({ lat: 10.4235, lng: -75.546 })
    expect(city.bounds).toEqual({ minX: -100, minY: -50, maxX: 100, maxY: 50 })

    expect(city.barrios).toHaveLength(1)
    expect(city.barrios[0].name).toBe("Centro")
    expect(city.barrios[0].center).toEqual([5, 5])
    expect(city.barrios[0].ring).toBeInstanceOf(Float32Array)
    expect(Array.from(city.barrios[0].ring)).toEqual([0, 0, 10, 0, 10, 10, 0, 10])

    expect(city.buildings).toHaveLength(1)
    expect(city.buildings[0].height).toBe(12)
    expect(city.buildings[0].name).toBe("Casa Colonial")
    expect(city.buildings[0].facade).toBe(2)
    expect(city.buildings[0].roof).toBe(1)
    expect(city.buildings[0].barrio).toBe(0)
    expect(city.buildings[0].rings[0]).toBeInstanceOf(Float32Array)
    expect(Array.from(city.buildings[0].rings[0])).toEqual([1, 1, 4, 1, 4, 4, 1, 4])

    expect(city.graph.nodes).toBeInstanceOf(Float32Array)
    expect(Array.from(city.graph.nodes)).toEqual([0, 5, 10, 5])
    expect(city.graph.edges).toBeInstanceOf(Uint32Array)
    expect(Array.from(city.graph.edges)).toEqual([0, 1])

    expect(city.landmarks[0]).toEqual({ name: "Torre", kind: "monument", x: 5, y: 5 })
  })
})
