import { describe, expect, it } from "vitest"
import { createProjection, toScene } from "@/features/city3d/domain/projection"

describe("projection", () => {
  const origin = { lat: 10.4235, lng: -75.546 }

  describe("createProjection", () => {
    it("mapea el origen a [0, 0]", () => {
      const proj = createProjection(origin)
      const [x, y] = proj.toLocal(origin)
      expect(x).toBe(0)
      expect(y).toBe(0)
    })

    it("0.001° de longitud al este da x positivo ~109.5 m a lat ~10.42", () => {
      const proj = createProjection({ lat: 10.42, lng: -75.546 })
      const [x, y] = proj.toLocal({ lat: 10.42, lng: -75.545 })
      expect(x).toBeGreaterThan(109)
      expect(x).toBeLessThan(110)
      expect(x).toBeCloseTo(109.484, 2)
      expect(y).toBe(0)
    })

    it("desplazamiento hacia el norte da y positivo", () => {
      const proj = createProjection(origin)
      const [x, y] = proj.toLocal({ lat: origin.lat + 0.001, lng: origin.lng })
      expect(x).toBe(0)
      expect(y).toBeGreaterThan(110)
      expect(y).toBeCloseTo(110.574, 3)
    })

    it("realiza ida y vuelta toLocal/toLatLng con error menor a 0.01 m", () => {
      const proj = createProjection(origin)
      const puntos = [
        { lat: 10.4235, lng: -75.546 },
        { lat: 10.428, lng: -75.541 },
        { lat: 10.419, lng: -75.552 },
        { lat: 10.431, lng: -75.539 },
      ]

      for (const p of puntos) {
        const [x, y] = proj.toLocal(p)
        const back = proj.toLatLng(x, y)
        const [x2, y2] = proj.toLocal(back)
        const errorMeters = Math.hypot(x2 - x, y2 - y)
        expect(errorMeters).toBeLessThan(0.01)
        expect(back.lat).toBeCloseTo(p.lat, 10)
        expect(back.lng).toBeCloseTo(p.lng, 10)
      }
    })
  })

  describe("toScene", () => {
    it("convierte coordenadas locales (x, y, h) a escena three.js con z = -y", () => {
      expect(toScene(12, 34)).toEqual([12, 0, -34])
      expect(toScene(-5, 18, 9.5)).toEqual([-5, 9.5, -18])
      expect(toScene(0, 0, 4)).toEqual([0, 4, -0])
    })
  })
})
