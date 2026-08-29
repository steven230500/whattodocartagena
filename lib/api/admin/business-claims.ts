import { cookies } from "next/headers"
import { API_URL } from "../config"

export interface AdminBusinessClaim {
  id: string
  businessName: string
  businessSlug: string
  userEmail: string
  message: string
  createdAt: string
}

interface ApiClaim {
  id: string
  business_name: string
  business_slug: string
  user_email: string
  message: string
  created_at: string
}

export async function getPendingClaims(): Promise<AdminBusinessClaim[]> {
  const cookieStore = await cookies()
  const adminKey = cookieStore.get("admin_key")?.value ?? ""

  const res = await fetch(`${API_URL}/api/admin/business-claims`, {
    headers: { "X-Admin-Key": adminKey },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`getPendingClaims: ${res.status}`)
  const data: ApiClaim[] = await res.json()
  return data.map((c) => ({
    id: c.id,
    businessName: c.business_name,
    businessSlug: c.business_slug,
    userEmail: c.user_email,
    message: c.message,
    createdAt: c.created_at,
  }))
}
