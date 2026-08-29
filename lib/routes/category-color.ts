// Rol fijo por categoría (DESIGN.md) — reemplaza el color aleatorio por item
// que tenía routes-grid.tsx. Presentación, no dato: no vive en la DB.
const CATEGORY_COLOR: Record<string, string> = {
  Historia: "bg-colonial-gold",
  Fortaleza: "bg-colonial-gold",
  Cultura: "bg-colonial-gold",
  Paisaje: "bg-caribbean-blue",
}

export function categoryColor(category: string): string {
  return CATEGORY_COLOR[category] ?? "bg-coral"
}
