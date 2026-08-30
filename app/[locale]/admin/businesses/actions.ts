"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { API_URL } from "@/lib/api/config"

export interface BusinessFormState {
  error?: string
}

interface BusinessPayload {
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
  phone: string | null
  web: string | null
  email: string | null
  instagram: string | null
  verified: boolean
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string" || v.trim() === "") return null
  return v.trim()
}

function payloadFromForm(formData: FormData): BusinessPayload {
  const tagsRaw = formData.get("tags")
  const tags =
    typeof tagsRaw === "string" && tagsRaw.trim() !== ""
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : []

  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    type: String(formData.get("type") ?? ""),
    subtype: String(formData.get("subtype") ?? ""),
    barrio: String(formData.get("barrio") ?? ""),
    lat: Number(formData.get("lat") ?? 0),
    lng: Number(formData.get("lng") ?? 0),
    image: String(formData.get("image") ?? ""),
    tags,
    description: String(formData.get("description") ?? ""),
    description_en: strOrNull(formData.get("description_en")),
    hours: strOrNull(formData.get("hours")),
    price_hint: strOrNull(formData.get("price_hint")),
    phone: strOrNull(formData.get("phone")),
    web: strOrNull(formData.get("web")),
    email: strOrNull(formData.get("email")),
    instagram: strOrNull(formData.get("instagram")),
    verified: formData.get("verified") === "on",
  }
}

async function adminKey(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get("admin_key")?.value ?? ""
}

export async function createBusiness(
  _prevState: BusinessFormState | undefined,
  formData: FormData,
): Promise<BusinessFormState> {
  const res = await fetch(`${API_URL}/api/admin/businesses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} creando el comercio.` }
  }

  revalidatePath("/businesses")
  revalidatePath("/admin/businesses")
  redirect("/admin/businesses")
}

export async function updateBusiness(
  id: string,
  _prevState: BusinessFormState | undefined,
  formData: FormData,
): Promise<BusinessFormState> {
  const res = await fetch(`${API_URL}/api/admin/businesses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} actualizando el comercio.` }
  }

  revalidatePath("/businesses")
  revalidatePath(`/businesses/${payloadFromForm(formData).slug}`)
  revalidatePath("/admin/businesses")
  redirect("/admin/businesses")
}

export async function deleteBusiness(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/businesses/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Key": await adminKey() },
  })

  if (!res.ok) {
    throw new Error(`Error ${res.status} borrando el comercio.`)
  }

  revalidatePath("/businesses")
  revalidatePath("/admin/businesses")
}
