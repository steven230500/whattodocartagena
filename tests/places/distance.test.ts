import { describe, expect, it } from "vitest"
import { distanceMeters, formatDistance } from "@/features/places/domain/distance"

describe("distancias", () => {
  it("Torre del Reloj → Plaza Santo Domingo ≈ 340 m", () => {
    const d = distanceMeters({ lat: 10.42302, lng: -75.54921 }, { lat: 10.42435, lng: -75.55198 })
    expect(d).toBeGreaterThan(300)
    expect(d).toBeLessThan(380)
  })

  it("la distancia a uno mismo es cero y es simétrica", () => {
    const a = { lat: 10.42, lng: -75.55 }
    const b = { lat: 10.43, lng: -75.54 }
    expect(distanceMeters(a, a)).toBe(0)
    expect(distanceMeters(a, b)).toBeCloseTo(distanceMeters(b, a), 6)
  })

  it("formatea en metros y kilómetros según el idioma", () => {
    expect(formatDistance(343)).toBe("340 m")
    expect(formatDistance(1234)).toBe("1,2 km")
    expect(formatDistance(1234, "en")).toBe("1.2 km")
  })
})
