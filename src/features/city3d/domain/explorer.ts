/**
 * Lo que el explorador 3D necesita de la app, desacoplado de los tipos de la API.
 * La página adapta Commerce / Route a estas formas.
 */
import type { LatLng } from "./projection"

export type PlaceKind = "heritage" | "food" | "culture" | "shop" | "nature"

export interface ExplorerPlace {
  id: string
  name: string
  kind: PlaceKind
  position: LatLng
  subtitle?: string
  image?: string
  href?: string
}

export interface ExplorerRouteStop {
  id: string
  title: string
  position: LatLng
}

export interface ExplorerRoute {
  id: string
  slug: string
  title: string
  duration?: string
  distance?: string
  stops: ExplorerRouteStop[]
}
