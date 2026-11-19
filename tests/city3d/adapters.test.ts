import { describe, expect, it } from "vitest"
import type { BasePoint } from "@/components/map/types"
import type { Route } from "@/lib/api/routes"
import type { Commerce } from "@/lib/types/commerce"
import {
  placesFromCommerces,
  placesFromPois,
  routesForExplorer,
} from "@/features/city3d/infrastructure/adapters"

const baseCommerce = (overrides: Partial<Commerce>): Commerce => ({
  name: "Comercio",
  slug: "comercio",
  type: "shop",
  subtype: "general",
  barrio: "Centro",
  coords: { lat: 10.423, lng: -75.546 },
  image: "/img/comercio.jpg",
  tags: [],
  contact: {},
  description: "Descripción en español",
  ...overrides,
})

describe("adapters", () => {
  describe("placesFromCommerces", () => {
    it("mapea correctamente los tipos de comercio a PlaceKind y construye href", () => {
      const items: Commerce[] = [
        baseCommerce({ slug: "rest", type: "food" }),
        baseCommerce({ slug: "art", type: "artisan" }),
        baseCommerce({ slug: "shp", type: "shop" }),
        baseCommerce({ slug: "mll", type: "mall" }),
        baseCommerce({ slug: "srv", type: "service" }),
        baseCommerce({ slug: "clt", type: "culture" }),
      ]

      const places = placesFromCommerces(items, "es")
      expect(places.map((p) => p.kind)).toEqual([
        "food",
        "shop",
        "shop",
        "shop",
        "shop",
        "culture",
      ])
      expect(places[0].id).toBe("biz-rest")
      expect(places[0].href).toBe("/businesses/rest")
    })

    it("usa descriptionEn cuando locale es en y existe", () => {
      const items = [
        baseCommerce({ slug: "a", description: "ES", descriptionEn: "EN" }),
        baseCommerce({ slug: "b", description: "Solo ES" }),
      ]

      const enPlaces = placesFromCommerces(items, "en")
      expect(enPlaces[0].subtitle).toBe("EN")
      expect(enPlaces[1].subtitle).toBe("Solo ES")

      const esPlaces = placesFromCommerces(items, "es")
      expect(esPlaces[0].subtitle).toBe("ES")
    })

    it("filtra comercios con coordenadas no finitas", () => {
      const items = [
        baseCommerce({ slug: "valid", coords: { lat: 10.42, lng: -75.54 } }),
        baseCommerce({ slug: "nan", coords: { lat: Number.NaN, lng: -75.54 } }),
        baseCommerce({ slug: "inf", coords: { lat: 10.42, lng: Number.POSITIVE_INFINITY } }),
      ]

      const places = placesFromCommerces(items, "es")
      expect(places).toHaveLength(1)
      expect(places[0].id).toBe("biz-valid")
    })
  })

  describe("placesFromPois", () => {
    it("mapea historic y photo a heritage y conserva los demás tipos", () => {
      const pois: BasePoint[] = [
        { id: 1, name: "Muralla", type: "historic", coords: { lat: 10.42, lng: -75.54 } },
        { id: "cam", name: "Mirador", type: "photo", coords: { lat: 10.421, lng: -75.541 } },
        { id: 3, name: "Museo", type: "culture", coords: { lat: 10.422, lng: -75.542 } },
      ]

      const places = placesFromPois(pois)
      expect(places[0]).toMatchObject({ id: "poi-1", kind: "heritage" })
      expect(places[1]).toMatchObject({ id: "poi-cam", kind: "heritage" })
      expect(places[2]).toMatchObject({ id: "poi-3", kind: "culture" })
    })
  })

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
