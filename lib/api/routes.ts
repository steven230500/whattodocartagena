import { API_URL } from "./config"

export interface RouteStep {
  id: string
  title: string
  description: string
  audioUrl?: string
  duration?: string
  coordinates?: { lat: number; lng: number }
  image?: string
}

export interface Route {
  id: string
  slug: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  duration: string
  distance: string
  difficulty: string
  category: string
  image: string
  highlights: string[]
  audioGuide: boolean
  offline: boolean
  price: string
  steps: RouteStep[]
}

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
  title_en: string | null
  description: string
  description_en: string | null
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
    titleEn: r.title_en ?? undefined,
    description: r.description,
    descriptionEn: r.description_en ?? undefined,
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

export async function getRoutes(): Promise<Route[]> {
  const res = await fetch(`${API_URL}/api/routes`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`getRoutes: ${res.status}`)
  const data: ApiRoute[] = await res.json()
  return data.map(toRoute)
}

export async function getRouteBySlug(slug: string): Promise<Route | null> {
  const res = await fetch(`${API_URL}/api/routes/${slug}`, { next: { revalidate: 60 } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`getRouteBySlug: ${res.status}`)
  const data: ApiRoute = await res.json()
  return toRoute(data)
}
