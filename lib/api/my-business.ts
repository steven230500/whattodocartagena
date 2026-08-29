import { API_URL } from "./config"
import { getUserToken } from "./auth"
import type { ClaimStatus } from "./business-claims"

export interface MyBusiness {
  id: string
  name: string
  slug: string
  description: string
  hours?: string
  priceHint?: string
  priceTypicalNote?: string
  phone?: string
  web?: string
  email?: string
  instagram?: string
  image: string
  tags: string[]
}

export interface MyBusinessClaim {
  id: string
  businessName: string
  businessSlug: string
  status: ClaimStatus
  message: string
  createdAt: string
}

interface ApiBusiness {
  id: string
  name: string
  slug: string
  description: string
  hours: string | null
  price_hint: string | null
  price_typical_note: string | null
  phone: string | null
  web: string | null
  email: string | null
  instagram: string | null
  image: string
  tags: string[]
}

interface ApiClaim {
  id: string
  business_name: string
  business_slug: string
  status: ClaimStatus
  message: string
  created_at: string
}

function toMyBusiness(b: ApiBusiness): MyBusiness {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    description: b.description,
    hours: b.hours ?? undefined,
    priceHint: b.price_hint ?? undefined,
    priceTypicalNote: b.price_typical_note ?? undefined,
    phone: b.phone ?? undefined,
    web: b.web ?? undefined,
    email: b.email ?? undefined,
    instagram: b.instagram ?? undefined,
    image: b.image,
    tags: b.tags,
  }
}

function toMyClaim(c: ApiClaim): MyBusinessClaim {
  return {
    id: c.id,
    businessName: c.business_name,
    businessSlug: c.business_slug,
    status: c.status,
    message: c.message,
    createdAt: c.created_at,
  }
}

// getMyBusinesses/getMyClaims asumen sesión ya confirmada (la página redirige
// a /login antes de llamarlas) — devuelven [] si el fetch falla igual, sin tirar.
export async function getMyBusinesses(): Promise<MyBusiness[]> {
  const token = await getUserToken()
  if (!token) return []

  const res = await fetch(`${API_URL}/api/me/businesses`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return []

  const data: ApiBusiness[] = await res.json()
  return data.map(toMyBusiness)
}

export async function getMyBusinessById(id: string): Promise<MyBusiness | null> {
  const all = await getMyBusinesses()
  return all.find((b) => b.id === id) ?? null
}

export async function getMyClaims(): Promise<MyBusinessClaim[]> {
  const token = await getUserToken()
  if (!token) return []

  const res = await fetch(`${API_URL}/api/me/business-claims`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return []

  const data: ApiClaim[] = await res.json()
  return data.map(toMyClaim)
}
