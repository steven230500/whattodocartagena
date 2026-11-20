/**
 * Enlaces a Google Maps (Maps URLs, sin API key):
 * https://developers.google.com/maps/documentation/urls/get-started
 */
export interface LatLng {
  lat: number
  lng: number
}

/** Google Maps acepta hasta 9 paradas intermedias (en navegadores de celular, menos). */
export const MAX_WAYPOINTS = 9

const coord = (p: LatLng) => `${+p.lat.toFixed(6)},${+p.lng.toFixed(6)}`

/** Toma `max` elementos repartidos de forma pareja, conservando el orden. */
function spread<T>(items: T[], max: number): T[] {
  if (items.length <= max) return items
  return Array.from({ length: max }, (_, i) => items[Math.round((i * (items.length - 1)) / (max - 1))])
}

/**
 * La ruta completa a pie: sale de la primera parada, pasa por las demás en
 * orden y termina en la última. Con una sola parada, indicaciones hasta ella.
 */
export function googleMapsWalkingRouteUrl(stops: LatLng[]): string | null {
  if (stops.length === 0) return null
  const params = new URLSearchParams({ api: "1" })
  if (stops.length > 1) params.set("origin", coord(stops[0]))
  params.set("destination", coord(stops[stops.length - 1]))
  const middle = spread(stops.slice(1, -1), MAX_WAYPOINTS)
  if (middle.length) params.set("waypoints", middle.map(coord).join("|"))
  params.set("travelmode", "walking")
  return `https://www.google.com/maps/dir/?${params}`
}

/** Un punto en Google Maps (por coordenadas: el nombre podría dar con otro lugar). */
export function googleMapsPlaceUrl(p: LatLng): string {
  return `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query: coord(p) })}`
}
