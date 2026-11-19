/**
 * Traduce las rutas de la API a las del explorador 3D. Los lugares se adaptan
 * en features/places (compartidos con el mapa 2D).
 */
import type { Route } from "@/lib/api/routes"
import type { ExplorerRoute } from "../domain/explorer"

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
