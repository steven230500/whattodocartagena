// City 3D Feature Module — explorador 3D de Cartagena (OSM + three.js)
export type { ExplorerPlace, ExplorerRoute, ExplorerRouteStop, PlaceKind } from "./domain/explorer"
export { routesForExplorer } from "./infrastructure/adapters"
export { default as LazyCityExplorer } from "./presentation/LazyCityExplorer"
