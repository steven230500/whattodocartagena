import { describe, expect, it } from "vitest"
import { findBuildingAt } from "@/features/city3d/domain/city-queries"
import type { CityBuilding } from "@/features/city3d/domain/city-model"

const square = (x: number, y: number, s: number): CityBuilding => ({
  rings: [new Float32Array([x, y, x + s, y, x + s, y + s, x, y + s])],
  height: 8,
  facade: 0,
  roof: 0,
  barrio: 0,
})

describe("findBuildingAt", () => {
  const buildings = [square(0, 0, 10), square(50, 0, 10)]

  it("devuelve el edificio que contiene el punto", () => {
    expect(findBuildingAt(buildings, 5, 5)).toBe(0)
    expect(findBuildingAt(buildings, 55, 2)).toBe(1)
  })

  it("si el punto cae en la calle, el centro más cercano dentro del radio", () => {
    expect(findBuildingAt(buildings, 20, 5)).toBe(0)
    expect(findBuildingAt(buildings, 44, 5)).toBe(1)
  })

  it("-1 si no hay ningún edificio cerca", () => {
    expect(findBuildingAt(buildings, 500, 500)).toBe(-1)
    expect(findBuildingAt(buildings, 30, 5, 5)).toBe(-1)
  })
})

describe("focusDistance", () => {
  it("acerca la cámara a lo chico y la aleja de lo grande, con tope", async () => {
    const { focusDistance } = await import("@/features/city3d/domain/city-queries")
    const small = square(0, 0, 10)
    const big = square(0, 0, 250)
    const huge = square(0, 0, 2000)
    expect(focusDistance([small], 0)).toBe(210)
    expect(focusDistance([big], 0)).toBeGreaterThan(700)
    expect(focusDistance([huge], 0)).toBe(900)
    expect(focusDistance([small], 5)).toBe(210)
  })
})
