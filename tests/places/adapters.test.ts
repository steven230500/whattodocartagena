import { describe, expect, it } from "vitest"
import type { Commerce } from "@/lib/types/commerce"
import type { CuratedPoi } from "@/lib/map/curated-pois"
import { appPlaces, mergePlaces, placesFromCommerces, placesFromCurated } from "@/features/places/infrastructure/adapters"

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


describe("adapters de lugares", () => {
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


  it("placesFromCommerces conserva barrio y horario", () => {
    const [p] = placesFromCommerces([baseCommerce({ barrio: "Getsemaní", hours: "12:00 - 23:00" })], "es")
    expect(p.barrio).toBe("Getsemaní")
    expect(p.hours).toBe("12:00 - 23:00")
  })

  describe("placesFromCurated", () => {
    const poi: CuratedPoi = {
      id: "torre",
      name: "Torre del Reloj",
      kind: "heritage",
      position: { lat: 10.42302, lng: -75.54921 },
      barrio: "Centro",
      description: { es: "Puerta principal", en: "Main gate" },
    }
    it("usa la descripción del idioma y prefija el id", () => {
      expect(placesFromCurated([poi], "es")[0]).toMatchObject({ id: "poi-torre", subtitle: "Puerta principal", barrio: "Centro" })
      expect(placesFromCurated([poi], "en")[0].subtitle).toBe("Main gate")
    })
  })

  describe("mergePlaces", () => {
    it("si un sitio curado ya es negocio (mismo nombre, sin importar tildes ni mayúsculas), gana el negocio", () => {
      const curated = placesFromCurated(
        [
          { id: "bovedas", name: "Las Bóvedas", kind: "culture", position: { lat: 10.43, lng: -75.546 }, barrio: "San Diego", description: { es: "", en: "" } },
          { id: "torre", name: "Torre del Reloj", kind: "heritage", position: { lat: 10.423, lng: -75.549 }, barrio: "Centro", description: { es: "", en: "" } },
        ],
        "es",
      )
      const businesses = placesFromCommerces([baseCommerce({ name: "LAS BOVEDAS", slug: "las-bovedas" })], "es")
      const merged = mergePlaces(curated, businesses)
      expect(merged.map((p) => p.id)).toEqual(["poi-torre", "biz-las-bovedas"])
    })

    it("appPlaces junta curados y negocios", () => {
      const all = appPlaces([], [baseCommerce({ slug: "x" })], "es")
      expect(all).toHaveLength(1)
    })
  })
})
