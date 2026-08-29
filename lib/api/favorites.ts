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

// getFavoriteSlugs devuelve los slugs favoritos del usuario logueado, o [] si no
// hay sesión — así las páginas públicas pueden llamarla siempre sin chequear antes.
export async function getFavoriteSlugs(): Promise<string[]> {
  const token = await getUserToken()
  if (!token) return []

  const res = await fetch(`${API_URL}/api/me/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return []

  const data: ApiBusinessMinimal[] = await res.json()
  return data.map((b) => b.slug)
}

export type ToggleFavoriteResult = "ok" | "unauthorized" | "error"

export async function addFavorite(slug: string): Promise<ToggleFavoriteResult> {
  const token = await getUserToken()
  if (!token) return "unauthorized"

  const businessID = await resolveBusinessID(slug)
  if (!businessID) return "error"

  const res = await fetch(`${API_URL}/api/me/favorites/${businessID}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 401) return "unauthorized"
  return res.ok ? "ok" : "error"
}

export async function removeFavorite(slug: string): Promise<ToggleFavoriteResult> {
  const token = await getUserToken()
  if (!token) return "unauthorized"

  const businessID = await resolveBusinessID(slug)
  if (!businessID) return "error"

  const res = await fetch(`${API_URL}/api/me/favorites/${businessID}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 401) return "unauthorized"
  return res.ok ? "ok" : "error"
}
