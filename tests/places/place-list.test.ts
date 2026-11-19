import { describe, expect, it } from "vitest"
import { barriosOf, placeRows, type PlaceFilters } from "@/features/places/application/place-list"
import { PLACE_KINDS, type Place } from "@/features/places/domain/place"

const place = (id: string, over: Partial<Place> = {}): Place => ({
  id,
  name: id,
  kind: "heritage",
  position: { lat: 10.423, lng: -75.549 },
  ...over,
})

const places: Place[] = [
  place("torre", { name: "Torre del Reloj", barrio: "Centro" }),
  place("cafe", { name: "Café Plaza", kind: "food", barrio: "Centro", hours: "08:00 - 18:00", position: { lat: 10.4243, lng: -75.5517 } }),
  place("galeria", { name: "Galería", kind: "culture", barrio: "Getsemaní", hours: "Mié-Dom 10:00-19:00", position: { lat: 10.4207, lng: -75.5458 } }),
  place("museo", { name: "Museo del Oro Zenú", kind: "culture", barrio: "Centro", subtitle: "Orfebrería prehispánica" }),
]

const all: PlaceFilters = { query: "", kinds: PLACE_KINDS, barrio: "", openNow: false }
const mondayNoon = new Date("2026-11-16T12:00:00-05:00")
const ids = (f: Partial<PlaceFilters>, user = null as { lat: number; lng: number } | null) =>
  placeRows(places, { ...all, ...f }, mondayNoon, user).map((r) => r.place.id)

describe("lista de lugares", () => {
  it("sin filtros muestra todo en el orden de los datos", () => {
    expect(ids({})).toEqual(["torre", "cafe", "galeria", "museo"])
  })

  it("filtra por tipo y por barrio", () => {
    expect(ids({ kinds: ["culture"] })).toEqual(["galeria", "museo"])
    expect(ids({ barrio: "Getsemaní" })).toEqual(["galeria"])
  })

  it("la búsqueda ignora tildes y mayúsculas y mira también la descripción", () => {
    expect(ids({ query: "CAFE" })).toEqual(["cafe"])
    expect(ids({ query: "orfebreria" })).toEqual(["museo"])
    expect(ids({ query: "galeria" })).toEqual(["galeria"])
  })

  it("abierto ahora deja solo los que tienen horario y están abiertos", () => {
    // lunes al mediodía: el café abre, la galería abre de miércoles a domingo, los demás no tienen horario
    expect(ids({ openNow: true })).toEqual(["cafe"])
    const rows = placeRows(places, all, mondayNoon, null)
    expect(rows.find((r) => r.place.id === "cafe")!.status).toEqual({ open: true, closesAt: 1080 })
    expect(rows.find((r) => r.place.id === "galeria")!.status).toEqual({ open: false })
    expect(rows.find((r) => r.place.id === "torre")!.status).toBeNull()
  })

  it("con ubicación ordena por cercanía y calcula la distancia", () => {
    const rows = placeRows(places, all, mondayNoon, { lat: 10.4207, lng: -75.5458 })
    expect(rows[0].place.id).toBe("galeria")
    expect(rows[0].distance).toBeLessThan(1)
    for (let i = 1; i < rows.length; i++) expect(rows[i].distance!).toBeGreaterThanOrEqual(rows[i - 1].distance!)
  })

  it("barriosOf lista los barrios presentes, sin repetir y en orden", () => {
    expect(barriosOf(places)).toEqual(["Centro", "Getsemaní"])
  })
})

describe("sin hora conocida (render del servidor)", () => {
  it("no calcula estado de apertura", () => {
    const rows = placeRows(places, all, null, null)
    expect(rows.every((r) => r.status === null)).toBe(true)
  })
})
