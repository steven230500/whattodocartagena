/**
 * Lugar mostrado en los mapas (2D y 3D): sitios curados y negocios de la API,
 * ya traducidos al idioma de la página. Puro: sin React ni Leaflet.
 */
export interface LatLng {
  lat: number
  lng: number
}

export type PlaceKind = "heritage" | "food" | "culture" | "shop" | "nature"

/** Orden fijo de los filtros por tipo. */
export const PLACE_KINDS: PlaceKind[] = ["heritage", "food", "culture", "shop", "nature"]

export interface Place {
  id: string
  name: string
  kind: PlaceKind
  position: LatLng
  subtitle?: string
  image?: string
  /** página de detalle dentro de la app */
  href?: string
  barrio?: string
  /** horario en texto libre, como lo escribe el negocio */
  hours?: string
}
