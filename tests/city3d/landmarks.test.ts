import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { decodeCity } from "@/features/city3d/infrastructure/load-city"
import { buildLandmarks } from "@/features/city3d/presentation/mesh/landmarks"
import { buildBuildings } from "@/features/city3d/presentation/mesh/geometry"
import type { RawCity } from "@/features/city3d/domain/city-model"

const model = decodeCity(JSON.parse(readFileSync("public/3d/cartagena.json", "utf8")) as RawCity)

describe("monumentos", () => {
  const meshes = buildLandmarks(model)

  it("modela los cinco monumentos marcados por el pipeline", () => {
    expect(meshes.map((m) => m.key).sort()).toEqual(["castillo", "catedral", "san-pedro", "torre-reloj", "trinidad"])
  })

  it("cada modelo tiene geometría con color y queda sobre su huella", () => {
    for (const m of meshes) {
      const geo = m.geometry
      expect(geo.getAttribute("position").count).toBeGreaterThan(30)
      expect(geo.getAttribute("color").count).toBe(geo.getAttribute("position").count)
      geo.computeBoundingBox()
      const box = geo.boundingBox!
      expect(box.min.y).toBeGreaterThanOrEqual(-0.01)
      expect(box.max.y).toBeGreaterThan(10)
      // el centro declarado (x, y locales → escena x, -z) cae dentro del modelo
      expect(m.center[0]).toBeGreaterThan(box.min.x)
      expect(m.center[0]).toBeLessThan(box.max.x)
      expect(-m.center[1]).toBeGreaterThan(box.min.z)
      expect(-m.center[1]).toBeLessThan(box.max.z)
      expect(box.max.x - box.min.x).toBeLessThan(300)
    }
  })

  it("la torre del reloj sobresale de la muralla y la catedral es lo más alto del Centro", () => {
    const byKey = Object.fromEntries(meshes.map((m) => [m.key, m]))
    expect(byKey["torre-reloj"].height).toBeGreaterThan(25)
    expect(byKey.catedral.height).toBeGreaterThan(byKey["san-pedro"].height)
  })

  it("los monumentos no se levantan además como bloques genéricos", () => {
    const { geometry } = buildBuildings(model)
    const ids = geometry.getAttribute("aId")
    const landmarkIds = new Set(meshes.map((m) => m.buildingId))
    for (let i = 0; i < ids.count; i += 97) expect(landmarkIds.has(ids.getX(i))).toBe(false)
    for (const id of landmarkIds) {
      let found = false
      for (let i = 0; i < ids.count && !found; i++) found = ids.getX(i) === id
      expect(found).toBe(false)
    }
  })
})
