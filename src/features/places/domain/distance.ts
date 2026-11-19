import type { LatLng } from "./place"

const R = 6_371_000

/** Distancia en metros sobre la esfera (haversine). */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLng = (b.lng - a.lng) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** "350 m" / "1,2 km" (coma decimal en español, punto en inglés). */
export function formatDistance(meters: number, locale = "es"): string {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`
  const km = (meters / 1000).toFixed(1)
  return `${locale === "en" ? km : km.replace(".", ",")} km`
}
