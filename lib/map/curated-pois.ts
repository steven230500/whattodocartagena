import type { LatLng, PlaceKind } from "@/features/places/domain/place"

export interface CuratedPoi {
  id: string
  name: string
  kind: PlaceKind
  position: LatLng
  barrio: string
  description: { es: string; en: string }
  /** solo fotos reales del propio lugar */
  image?: string
}

/**
 * Sitios de patrimonio y cultura que no son negocios (los negocios vienen de la API).
 * Coordenadas verificadas contra OpenStreetMap (2026-11-19).
 */
export const CURATED_POIS: CuratedPoi[] = [
  {
    id: "torre-del-reloj",
    name: "Torre del Reloj",
    kind: "heritage",
    position: { lat: 10.42302, lng: -75.54921 },
    barrio: "Centro",
    description: {
      es: "Puerta principal de la ciudad amurallada.",
      en: "Main gate of the walled city.",
    },
    image: "/puerta-del-reloj-cartagena-clock-tower.jpg",
  },
  {
    id: "plaza-santo-domingo",
    name: "Plaza Santo Domingo",
    kind: "heritage",
    position: { lat: 10.42435, lng: -75.55198 },
    barrio: "Centro",
    description: {
      es: "Plaza con la escultura de Botero y cafés alrededor.",
      en: "Square with the Botero sculpture, surrounded by cafés.",
    },
  },
  {
    id: "castillo-san-felipe",
    name: "Castillo San Felipe",
    kind: "heritage",
    position: { lat: 10.42238, lng: -75.53907 },
    barrio: "Pie del Cerro",
    description: {
      es: "La fortaleza más grande construida por España en América.",
      en: "The largest fortress Spain built in the Americas.",
    },
    image: "/castillo-san-felipe-fortress-cartagena.jpg",
  },
  {
    id: "teatro-heredia",
    name: "Teatro Adolfo Mejía (Heredia)",
    kind: "culture",
    position: { lat: 10.42665, lng: -75.55114 },
    barrio: "Centro",
    description: {
      es: "Principal escenario cultural de la ciudad.",
      en: "The city's main cultural stage.",
    },
  },
  {
    id: "museo-oro-zenu",
    name: "Museo del Oro Zenú",
    kind: "culture",
    position: { lat: 10.4227, lng: -75.55098 },
    barrio: "Centro",
    description: {
      es: "Orfebrería prehispánica de la cultura Zenú.",
      en: "Pre-Hispanic goldwork of the Zenú culture.",
    },
  },
  {
    id: "getsemani",
    name: "Plaza de la Trinidad, Getsemaní",
    kind: "heritage",
    position: { lat: 10.42061, lng: -75.5454 },
    barrio: "Getsemaní",
    description: {
      es: "Arte callejero, vida de barrio y calles coloridas.",
      en: "Street art, neighborhood life and colorful streets.",
    },
    image: "/getsemani-street-art-colorful-buildings.jpg",
  },
]
