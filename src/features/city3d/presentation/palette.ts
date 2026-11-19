/**
 * Paleta de la maqueta. Fachadas coloniales del Centro / San Diego / Getsemaní,
 * techos de teja y concreto para lo moderno. Los índices los asigna el pipeline.
 */
export const FACADES = [
  "#dba84a", // 0 ocre
  "#c96a43", // 1 terracota
  "#e9be45", // 2 mostaza
  "#f07b5d", // 3 coral
  "#3f7cc4", // 4 azul colonial
  "#f4ede1", // 5 blanco cal
  "#e79aa5", // 6 rosa
  "#88cfb2", // 7 menta
  "#c3bdb4", // 8 concreto
]

export const ROOFS = [
  "#b4542f", // 0 teja
  "#8e4228", // 1 teja vieja
  "#e6dfd4", // 2 placa clara
  "#a7a39c", // 3 placa gris
]

export const SURFACES = {
  land: "#efe2cb",
  shore: "#c9b48e",
  green: "#9cc887",
  plaza: "#e8d9bd",
  wall: "#b89c6e",
  wallTop: "#cdb487",
  streetMajor: "#a29b92",
  street: "#e3d6c0",
  footway: "#ece2cf",
  route: "#ff6b47", // coral: acento único de acción
  routeDone: "#f59e0b", // dorado colonial: progreso / patrimonio
}

/** Color de los pines por tipo (roles fijos de DESIGN.md). */
export const PLACE_COLORS = {
  heritage: "#f59e0b",
  food: "#ff6b47",
  culture: "#0ea5e9",
  shop: "#a855f7",
  nature: "#166534",
} as const
