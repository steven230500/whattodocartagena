import { describe, expect, it } from "vitest"
import { googleMapsPlaceUrl, googleMapsWalkingRouteUrl, MAX_WAYPOINTS } from "@/lib/maps/google-maps"

const params = (url: string) => new URL(url).searchParams

describe("googleMapsWalkingRouteUrl", () => {
  it("sale de la primera parada, pasa por las del medio en orden y llega a la última, a pie", () => {
    const url = googleMapsWalkingRouteUrl([
      { lat: 10.42302, lng: -75.54921 },
      { lat: 10.42435, lng: -75.55198 },
      { lat: 10.42371, lng: -75.55066 },
    ])!
    expect(url.startsWith("https://www.google.com/maps/dir/?api=1&")).toBe(true)
    const p = params(url)
    expect(p.get("origin")).toBe("10.42302,-75.54921")
    expect(p.get("waypoints")).toBe("10.42435,-75.55198")
    expect(p.get("destination")).toBe("10.42371,-75.55066")
    expect(p.get("travelmode")).toBe("walking")
  })

  it("con una sola parada da indicaciones hasta ella desde donde estés", () => {
    const p = params(googleMapsWalkingRouteUrl([{ lat: 10.4, lng: -75.5 }])!)
    expect(p.has("origin")).toBe(false)
    expect(p.has("waypoints")).toBe(false)
    expect(p.get("destination")).toBe("10.4,-75.5")
  })

  it("sin paradas no hay enlace", () => {
    expect(googleMapsWalkingRouteUrl([])).toBeNull()
  })

  it("si hay demasiadas paradas reparte las intermedias sin perder la primera ni la última", () => {
    const stops = Array.from({ length: 20 }, (_, i) => ({ lat: 10 + i / 100, lng: -75 }))
    const p = params(googleMapsWalkingRouteUrl(stops)!)
    const way = p.get("waypoints")!.split("|")
    expect(way).toHaveLength(MAX_WAYPOINTS)
    expect(way[0]).toBe("10.01,-75")
    expect(way.at(-1)).toBe("10.18,-75")
    expect(p.get("origin")).toBe("10,-75")
    expect(p.get("destination")).toBe("10.19,-75")
  })

  it("recorta los decimales a 6 (≈10 cm)", () => {
    const p = params(googleMapsWalkingRouteUrl([{ lat: 10.123456789, lng: -75.987654321 }])!)
    expect(p.get("destination")).toBe("10.123457,-75.987654")
  })
})

describe("googleMapsPlaceUrl", () => {
  it("busca por coordenadas", () => {
    const p = params(googleMapsPlaceUrl({ lat: 10.42369, lng: -75.55062 }))
    expect(p.get("api")).toBe("1")
    expect(p.get("query")).toBe("10.42369,-75.55062")
  })
})
