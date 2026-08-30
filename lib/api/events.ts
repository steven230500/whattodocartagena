import { API_URL } from "./config"
import type { Event } from "@/lib/types/commerce"

interface ApiEvent {
  id: string
  title: string
  title_en: string | null
  slug: string
  start_date: string
  end_date: string | null
  type: string
  venue: string
  related_business_id: string | null
  lat: number
  lng: number
  image: string
  tags: string[]
  description: string
  description_en: string | null
  content: string | null
}

function toEvent(e: ApiEvent): Event {
  return {
    title: e.title,
    titleEn: e.title_en ?? undefined,
    slug: e.slug,
    startDate: e.start_date,
    endDate: e.end_date ?? undefined,
    type: e.type as Event["type"],
    venue: e.venue,
    coords: { lat: e.lat, lng: e.lng },
    image: e.image,
    tags: e.tags,
    description: e.description,
    descriptionEn: e.description_en ?? undefined,
    content: e.content ?? undefined,
  }
}

export async function getEvents(): Promise<Event[]> {
  const res = await fetch(`${API_URL}/api/events`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`getEvents: ${res.status}`)
  const data: ApiEvent[] = await res.json()
  return data.map(toEvent)
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const res = await fetch(`${API_URL}/api/events/${slug}`, { next: { revalidate: 60 } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`getEventBySlug: ${res.status}`)
  const data: ApiEvent = await res.json()
  return toEvent(data)
}
