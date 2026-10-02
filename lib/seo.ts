import type { Metadata } from "next"
import { getLocale } from "next-intl/server"

export const siteUrl = "https://whattodocartagena.com"
const pages = {
  "": [
    "Qué hacer en Cartagena",
    "What to do in Cartagena",
    "Descubre actividades, eventos, comercios y rutas para conocer Cartagena de Indias.",
    "Discover activities, events, local businesses and routes in Cartagena de Indias."
  ],
  "events": [
    "Eventos en Cartagena",
    "Events in Cartagena",
    "Consulta eventos y actividades en Cartagena de Indias.",
    "Find events and activities in Cartagena de Indias."
  ],
  "routes": [
    "Rutas por Cartagena",
    "Routes around Cartagena",
    "Explora rutas para recorrer la historia y los barrios de Cartagena de Indias.",
    "Explore routes through the history and neighborhoods of Cartagena de Indias."
  ],
  "businesses": [
    "Comercios en Cartagena",
    "Local businesses in Cartagena",
    "Encuentra comercios, restaurantes y servicios en Cartagena de Indias.",
    "Find local businesses, restaurants and services in Cartagena de Indias."
  ],
  "history": [
    "Historia de Cartagena",
    "History of Cartagena",
    "Conoce la historia y el patrimonio de Cartagena de Indias.",
    "Discover the history and heritage of Cartagena de Indias."
  ],
  "map": [
    "Mapa de Cartagena",
    "Map of Cartagena",
    "Ubica lugares de interés de Cartagena de Indias en el mapa interactivo.",
    "Find places of interest in Cartagena de Indias on the interactive map."
  ],
  "explore": [
    "Explora Cartagena",
    "Explore Cartagena",
    "Explora lugares, rutas y actividades para tu visita a Cartagena.",
    "Explore places, routes and activities for your visit to Cartagena."
  ],
  "masses": [
    "Horarios de misas en Cartagena",
    "Mass times in Cartagena",
    "Consulta parroquias y horarios de misas en Cartagena de Indias.",
    "Find parishes and Mass times in Cartagena de Indias."
  ],
  "plans": [
    "Planes en Cartagena",
    "Things to do in Cartagena",
    "Descubre planes y experiencias para disfrutar Cartagena de Indias.",
    "Discover things to do and experiences to enjoy Cartagena de Indias."
  ]
} as const

export async function publicPageMetadata(path: keyof typeof pages): Promise<Metadata> {
  const locale = await getLocale()
  const english = locale === "en"
  const copy = pages[path]
  const title = `${copy[english ? 1 : 0]} | What to do Cartagena`
  const description = copy[english ? 3 : 2]
  const suffix = path ? `/${path}` : ""
  const url = `${siteUrl}${english ? "/en" : ""}${suffix}`
  return {
    title, description,
    alternates: { canonical: url, languages: { es: `${siteUrl}${suffix}`, en: `${siteUrl}/en${suffix}`, "x-default": `${siteUrl}${suffix}` } },
    openGraph: { title, description, url, siteName: "What to do Cartagena", type: "website", locale: english ? "en_US" : "es_CO" },
    twitter: { card: "summary", title, description },
  }
}
