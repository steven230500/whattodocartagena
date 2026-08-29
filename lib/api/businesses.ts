import { API_URL } from "./config"
import type { Commerce } from "@/lib/types/commerce"

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
  hours: string | null
  price_hint: string | null
  phone: string | null
  web: string | null
  email: string | null
  instagram: string | null
  owner_id: string | null
}

function toCommerce(b: ApiBusiness): Commerce {
  return {
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
    ownerId: b.owner_id ?? undefined,
  }
}

export async function getBusinesses(): Promise<Commerce[]> {
  const res = await fetch(`${API_URL}/api/businesses`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`getBusinesses: ${res.status}`)
  const data: ApiBusiness[] = await res.json()
  return data.map(toCommerce)
}

export async function getBusinessBySlug(slug: string): Promise<Commerce | null> {
  const res = await fetch(`${API_URL}/api/businesses/${slug}`, { next: { revalidate: 60 } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`getBusinessBySlug: ${res.status}`)
  const data: ApiBusiness = await res.json()
  return toCommerce(data)
}
