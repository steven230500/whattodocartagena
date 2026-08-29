import { API_URL } from "../config"
import type { Route, RouteStep } from "../routes"

interface ApiStep {
  id: string
  title: string
  description: string
  audio_url: string | null
  duration: string | null
  lat: number | null
  lng: number | null
  image: string | null
  position: number
}

interface ApiRoute {
  id: string
  slug: string
  title: string
  description: string
  duration: string
  distance: string
  difficulty: string
  category: string
  image: string
  highlights: string[]
  audio_guide: boolean
  offline: boolean
  price: string
  steps: ApiStep[]
}

function toStep(s: ApiStep): RouteStep {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    audioUrl: s.audio_url ?? undefined,
    duration: s.duration ?? undefined,
    coordinates: s.lat != null && s.lng != null ? { lat: s.lat, lng: s.lng } : undefined,
    image: s.image ?? undefined,
  }
}

function toRoute(r: ApiRoute): Route {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    duration: r.duration,
    distance: r.distance,
    difficulty: r.difficulty,
    category: r.category,
    image: r.image,
    highlights: r.highlights,
    audioGuide: r.audio_guide,
    offline: r.offline,
    price: r.price,
    steps: r.steps.map(toStep),
  }
}

export async function getAdminRoutes(): Promise<Route[]> {
  const res = await fetch(`${API_URL}/api/routes`, { cache: "no-store" })
  if (!res.ok) throw new Error(`getAdminRoutes: ${res.status}`)
  const data: ApiRoute[] = await res.json()
  return data.map(toRoute)
}

export async function getAdminRouteById(id: string): Promise<Route | null> {
  const all = await getAdminRoutes()
  return all.find((r) => r.id === id) ?? null
}
