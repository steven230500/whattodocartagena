/**
 * Traduce los tipos de la app (API de negocios, rutas, POIs curados) a los del
 * explorador 3D. Única capa que conoce ambos lados.
 */
import type { Commerce } from "@/lib/types/commerce"
import type { Route } from "@/lib/api/routes"
import type { BasePoint } from "@/components/map/types"
import type { ExplorerPlace, ExplorerRoute, PlaceKind } from "../domain/explorer"

const COMMERCE_KIND: Record<Commerce["type"], PlaceKind> = {
  food: "food",
  culture: "culture",
  artisan: "shop",
  shop: "shop",
  mall: "shop",
  service: "shop",
}

const POI_KIND: Record<BasePoint["type"], PlaceKind> = {
  historic: "heritage",
  photo: "heritage",
  culture: "culture",
  food: "food",
  mall: "shop",
  commerce: "shop",
}

export function placesFromCommerces(commerces: Commerce[], locale: string): ExplorerPlace[] {
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
    }))
}

export function placesFromPois(pois: BasePoint[]): ExplorerPlace[] {
  return pois.map((p) => ({
    id: `poi-${p.id}`,
    name: p.name,
    kind: POI_KIND[p.type] ?? "heritage",
    position: p.coords,
    subtitle: p.description,
    image: p.image,
  }))
}

export function routesForExplorer(routes: Route[], locale: string): ExplorerRoute[] {
  return routes
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      title: (locale === "en" && r.titleEn) || r.title,
      duration: r.duration || undefined,
      distance: r.distance || undefined,
      stops: r.steps
        .filter((s): s is typeof s & { coordinates: { lat: number; lng: number } } => s.coordinates != null)
        .map((s) => ({ id: s.id, title: s.title, position: s.coordinates })),
    }))
    .filter((r) => r.stops.length > 0)
}
