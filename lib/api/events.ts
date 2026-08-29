import { API_URL } from "./config"
import type { Event } from "@/lib/types/commerce"

interface ApiEvent {
  id: string
  title: string
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
  content: string | null
}

function toEvent(e: ApiEvent): Event {
  return {
    title: e.title,
    slug: e.slug,
    startDate: e.start_date,
    endDate: e.end_date ?? undefined,
    type: e.type as Event["type"],
    venue: e.venue,
    coords: { lat: e.lat, lng: e.lng },
    image: e.image,
    tags: e.tags,
    description: e.description,
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
