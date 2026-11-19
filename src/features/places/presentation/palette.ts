import type { PlaceKind } from "../domain/place"

/** Color de los pines por tipo (roles fijos de DESIGN.md), igual en el mapa 2D y el 3D. */
export const PLACE_COLORS: Record<PlaceKind, string> = {
  heritage: "#f59e0b", // dorado colonial: historia y patrimonio
  food: "#ff6b47", // coral
  culture: "#0ea5e9", // azul caribe
  shop: "#a855f7",
  nature: "#166534", // verde: naturaleza
}
