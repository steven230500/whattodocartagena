"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { API_URL } from "@/lib/api/config"

export interface EventFormState {
  error?: string
}

interface EventPayload {
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

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string" || v.trim() === "") return null
  return v.trim()
}

function payloadFromForm(formData: FormData): EventPayload {
  const tagsRaw = formData.get("tags")
  const tags =
    typeof tagsRaw === "string" && tagsRaw.trim() !== ""
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : []

  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    start_date: String(formData.get("startDate") ?? ""),
    end_date: strOrNull(formData.get("endDate")),
    type: String(formData.get("type") ?? ""),
    venue: String(formData.get("venue") ?? ""),
    lat: Number(formData.get("lat") ?? 0),
    lng: Number(formData.get("lng") ?? 0),
    image: String(formData.get("image") ?? ""),
    tags,
    description: String(formData.get("description") ?? ""),
    content: strOrNull(formData.get("content")),
  }
}

async function adminKey(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get("admin_key")?.value ?? ""
}

export async function createEvent(
  _prevState: EventFormState | undefined,
  formData: FormData,
): Promise<EventFormState> {
  const res = await fetch(`${API_URL}/api/admin/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} creando el evento.` }
  }

  revalidatePath("/events")
  revalidatePath("/admin/events")
  redirect("/admin/events")
}

export async function updateEvent(
  id: string,
  _prevState: EventFormState | undefined,
  formData: FormData,
): Promise<EventFormState> {
  const payload = payloadFromForm(formData)
  const res = await fetch(`${API_URL}/api/admin/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} actualizando el evento.` }
  }

  revalidatePath("/events")
  revalidatePath(`/events/${payload.slug}`)
  revalidatePath("/admin/events")
  redirect("/admin/events")
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/events/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Key": await adminKey() },
  })

  if (!res.ok) {
    throw new Error(`Error ${res.status} borrando el evento.`)
  }

  revalidatePath("/events")
  revalidatePath("/admin/events")
}
