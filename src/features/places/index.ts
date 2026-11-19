// Places Feature Module — lugares de la app para los mapas (2D y 3D)
export type { Place, PlaceKind, LatLng } from "./domain/place"
export { PLACE_KINDS } from "./domain/place"
export { parseHours, openStatus, formatClock } from "./domain/opening-hours"
export { distanceMeters, formatDistance } from "./domain/distance"
export { appPlaces, mergePlaces, placesFromCommerces, placesFromCurated } from "./infrastructure/adapters"
export { PLACE_COLORS } from "./presentation/palette"
export { default as PlacesMap } from "./presentation/PlacesMap"
