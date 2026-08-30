"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { API_URL } from "@/lib/api/config"

async function adminKey(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get("admin_key")?.value ?? ""
}

export async function approveClaim(id: string, businessSlug: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/business-claims/${id}/approve`, {
    method: "POST",
    headers: { "X-Admin-Key": await adminKey() },
  })
  if (!res.ok) {
    throw new Error(`Error ${res.status} aprobando el reclamo.`)
  }
  revalidatePath("/admin/business-claims")
  revalidatePath(`/businesses/${businessSlug}`)
}

export async function rejectClaim(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/business-claims/${id}/reject`, {
    method: "POST",
    headers: { "X-Admin-Key": await adminKey() },
  })
  if (!res.ok) {
    throw new Error(`Error ${res.status} rechazando el reclamo.`)
  }
  revalidatePath("/admin/business-claims")
}
