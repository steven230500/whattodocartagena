// Fetch admin-only: incluye `id`, a diferencia de lib/api/businesses.ts (Fase 2)
// que lo descarta a propósito porque el público nunca lo necesitó.
import { API_URL } from "../config"
import type { Commerce } from "@/lib/types/commerce"

export interface AdminBusiness extends Commerce {
  id: string
}

interface ApiBusiness {
  id: string
  name: string
  slug: string
  type: string
  subtype: string
  barrio: string
  lat: number
  lng: number
  image: string
  tags: string[]
  description: string
  description_en: string | null
  hours: string | null
  price_hint: string | null
  price_typical_note: string | null
  phone: string | null
  web: string | null
  email: string | null
  instagram: string | null
}

function toAdminBusiness(b: ApiBusiness): AdminBusiness {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    type: b.type as Commerce["type"],
    subtype: b.subtype,
    barrio: b.barrio,
    coords: { lat: b.lat, lng: b.lng },
    image: b.image,
    tags: b.tags,
    contact: {
      phone: b.phone ?? undefined,
      web: b.web ?? undefined,
      email: b.email ?? undefined,
      instagram: b.instagram ?? undefined,
    },
    hours: b.hours ?? undefined,
    priceHint: (b.price_hint as Commerce["priceHint"]) ?? undefined,
    description: b.description,
    descriptionEn: b.description_en ?? undefined,
  }
}

export async function getAdminBusinesses(): Promise<AdminBusiness[]> {
  const res = await fetch(`${API_URL}/api/businesses`, { cache: "no-store" })
  if (!res.ok) throw new Error(`getAdminBusinesses: ${res.status}`)
  const data: ApiBusiness[] = await res.json()
  return data.map(toAdminBusiness)
}

export async function getAdminBusinessById(id: string): Promise<AdminBusiness | null> {
  const all = await getAdminBusinesses()
  return all.find((b) => b.id === id) ?? null
}
