import { describe, expect, it } from "vitest"
import type { Route } from "@/lib/api/routes"
import { routesForExplorer } from "@/features/city3d/infrastructure/adapters"

describe("adapters", () => {
  describe("routesForExplorer", () => {
    const baseRoute = (overrides: Partial<Route>): Route => ({
      id: "r1",
      slug: "ruta-1",
      title: "Ruta Colonial",
      titleEn: "Colonial Route",
      description: "Desc",
      duration: "45 min",
      distance: "2 km",
      difficulty: "easy",
      category: "historic",
      image: "",
      highlights: [],
      audioGuide: false,
      offline: false,
      price: "0",
      steps: [],
      ...overrides,
    })

    it("usa titleEn cuando locale es en, quita pasos sin coordinates y descarta rutas sin paradas", () => {
      const routes: Route[] = [
        baseRoute({
          id: "r1",
          steps: [
            { id: "s1", title: "Parada 1", description: "", coordinates: { lat: 10.42, lng: -75.54 } },
            { id: "s2", title: "Sin coords", description: "" },
          ],
        }),
        baseRoute({
          id: "r2",
          slug: "sin-paradas",
          steps: [{ id: "s3", title: "Tampoco", description: "" }],
        }),
      ]

      const enRoutes = routesForExplorer(routes, "en")
      expect(enRoutes).toHaveLength(1)
      expect(enRoutes[0].title).toBe("Colonial Route")
      expect(enRoutes[0].stops).toEqual([
        { id: "s1", title: "Parada 1", position: { lat: 10.42, lng: -75.54 } },
      ])

      const esRoutes = routesForExplorer(routes, "es")
      expect(esRoutes[0].title).toBe("Ruta Colonial")
    })
  })
})

