import { API_URL } from "../config"
import type { Event } from "@/lib/types/commerce"

export interface AdminEvent extends Event {
  id: string
}

interface ApiEvent {
  id: string
  title: string
  slug: string
  start_date: string
  end_date: string | null
  type: string
  venue: string
  lat: number
  lng: number
  image: string
  tags: string[]
  description: string
  content: string | null
}

function toAdminEvent(e: ApiEvent): AdminEvent {
  return {
    id: e.id,
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

export async function getAdminEvents(): Promise<AdminEvent[]> {
  const res = await fetch(`${API_URL}/api/events`, { cache: "no-store" })
  if (!res.ok) throw new Error(`getAdminEvents: ${res.status}`)
  const data: ApiEvent[] = await res.json()
  return data.map(toAdminEvent)
}

export async function getAdminEventById(id: string): Promise<AdminEvent | null> {
  const all = await getAdminEvents()
  return all.find((e) => e.id === id) ?? null
}
