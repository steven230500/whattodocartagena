/**
 * Lo que el explorador 3D necesita de la app, desacoplado de los tipos de la API.
 * La página adapta Commerce / Route a estas formas.
 */
import type { LatLng, Place } from "@/features/places/domain/place"

export type { PlaceKind } from "@/features/places/domain/place"

/** Los lugares del 3D son los mismos de la app (features/places). */
export type ExplorerPlace = Place

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
