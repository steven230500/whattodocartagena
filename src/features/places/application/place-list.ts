/**
 * Filtros y orden de la lista de lugares. Puro: lo usa presentation/PlacesMap y se prueba con vitest.
 */
import type { LatLng, Place, PlaceKind } from "../domain/place"
import { openStatus, parseHours, type OpenStatus } from "../domain/opening-hours"
import { distanceMeters } from "../domain/distance"

export interface PlaceFilters {
  query: string
  kinds: PlaceKind[]
  /** "" = todos */
  barrio: string
  openNow: boolean
}

export interface PlaceRow {
  place: Place
  status: OpenStatus | null
  /** metros desde el usuario, si compartió su ubicación */
  distance: number | null
}

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")

/** `now` es null mientras no se conoce la hora del visitante (render del servidor): sin estado de apertura. */
export function placeRows(places: Place[], filters: PlaceFilters, now: Date | null, user: LatLng | null): PlaceRow[] {
  const q = fold(filters.query.trim())
  const rows = places
    .filter((p) => filters.kinds.includes(p.kind))
    .filter((p) => !filters.barrio || p.barrio === filters.barrio)
    .filter((p) => !q || fold(`${p.name} ${p.subtitle ?? ""} ${p.barrio ?? ""}`).includes(q))
    .map((place) => ({
      place,
      status: now ? openStatus(parseHours(place.hours), now) : null,
      distance: user ? distanceMeters(user, place.position) : null,
    }))
    .filter((r) => !filters.openNow || r.status?.open === true)
  if (user) rows.sort((a, b) => a.distance! - b.distance!)
  return rows
}

/** Barrios presentes en los datos, en orden alfabético. */
export function barriosOf(places: Place[]): string[] {
  return [...new Set(places.map((p) => p.barrio).filter((b): b is string => !!b))].sort((a, b) => a.localeCompare(b, "es"))
}
