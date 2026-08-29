import { API_URL } from "./config"
import { getUserToken } from "./auth"

interface ApiBusinessMinimal {
  id: string
  slug: string
}

async function resolveBusinessID(slug: string): Promise<string | null> {
  const res = await fetch(`${API_URL}/api/businesses/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  const data: ApiBusinessMinimal = await res.json()
  return data.id
}

export type ClaimStatus = "pending" | "approved" | "rejected"

interface ApiBusinessClaim {
  id: string
  business_slug: string
  status: ClaimStatus
}

// getMyClaimStatus devuelve el estado del reclamo más reciente del usuario
// logueado para este negocio, o null sin sesión / sin reclamo — nunca tira,
// para que la página del negocio pueda llamarla siempre sin chequear antes.
export async function getMyClaimStatus(slug: string): Promise<ClaimStatus | null> {
  const token = await getUserToken()
  if (!token) return null

  const res = await fetch(`${API_URL}/api/me/business-claims`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null

  const data: ApiBusinessClaim[] = await res.json()
  const claim = data.find((c) => c.business_slug === slug)
  return claim?.status ?? null
}

export type SubmitClaimResult = "ok" | "unauthorized" | "already-claimed" | "error"

export async function submitClaim(slug: string, message: string): Promise<SubmitClaimResult> {
  const token = await getUserToken()
  if (!token) return "unauthorized"

  const businessID = await resolveBusinessID(slug)
  if (!businessID) return "error"

  const res = await fetch(`${API_URL}/api/me/business-claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ business_id: businessID, message }),
  })
  if (res.status === 401) return "unauthorized"
  if (res.status === 400) return "already-claimed"
  return res.ok ? "ok" : "error"
}
