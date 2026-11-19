/**
 * Traduce los tipos de la app (negocios de la API y sitios curados) al modelo
 * de lugar de los mapas. Única capa que conoce ambos lados.
 */
import type { Commerce } from "@/lib/types/commerce"
import type { CuratedPoi } from "@/lib/map/curated-pois"
import type { Place, PlaceKind } from "../domain/place"

const COMMERCE_KIND: Record<Commerce["type"], PlaceKind> = {
  food: "food",
  culture: "culture",
  artisan: "shop",
  shop: "shop",
  mall: "shop",
  service: "shop",
}

export function placesFromCommerces(commerces: Commerce[], locale: string): Place[] {
  return commerces
    .filter((c) => Number.isFinite(c.coords?.lat) && Number.isFinite(c.coords?.lng))
    .map((c) => ({
      id: `biz-${c.slug}`,
      name: c.name,
      kind: COMMERCE_KIND[c.type] ?? "shop",
      position: c.coords,
      subtitle: (locale === "en" && c.descriptionEn) || c.description || c.barrio,
      image: c.image || undefined,
      href: `/businesses/${c.slug}`,
      barrio: c.barrio || undefined,
      hours: c.hours || undefined,
    }))
}

export function placesFromCurated(pois: CuratedPoi[], locale: string): Place[] {
  return pois.map((p) => ({
    id: `poi-${p.id}`,
    name: p.name,
    kind: p.kind,
    position: p.position,
    subtitle: locale === "en" ? p.description.en : p.description.es,
    image: p.image,
    barrio: p.barrio,
  }))
}

const key = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "")

/**
 * Sitios curados + negocios, sin duplicados: si un negocio ya existe en la API
 * (mismo nombre), gana el negocio, que tiene su página y sus datos al día.
 */
export function mergePlaces(curated: Place[], businesses: Place[]): Place[] {
  const names = new Set(businesses.map((b) => key(b.name)))
  return [...curated.filter((c) => !names.has(key(c.name))), ...businesses]
}

/** Lugares de la app para cualquier mapa. */
export function appPlaces(curated: CuratedPoi[], commerces: Commerce[], locale: string): Place[] {
  return mergePlaces(placesFromCurated(curated, locale), placesFromCommerces(commerces, locale))
}
