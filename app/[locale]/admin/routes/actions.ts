"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { API_URL } from "@/lib/api/config"

export interface RouteFormState {
  error?: string
}

export interface StepPayload {
  title: string
  description: string
  audio_url: string | null
  duration: string | null
  lat: number | null
  lng: number | null
  image: string | null
}

interface RoutePayload {
  slug: string
  title: string
  title_en: string | null
  description: string
  description_en: string | null
  duration: string
  distance: string
  difficulty: string
  category: string
  image: string
  highlights: string[]
  audio_guide: boolean
  offline: boolean
  price: string
  steps: StepPayload[]
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string" || v.trim() === "") return null
  return v.trim()
}

function numOrNull(v: FormDataEntryValue | null): number | null {
  if (typeof v !== "string" || v.trim() === "") return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

// Los pasos llegan como JSON serializado en un input hidden (el form los arma
// dinámicamente del lado cliente) — más simple que parsear N campos indexados.
function payloadFromForm(formData: FormData): RoutePayload {
  const tagsRaw = formData.get("highlights")
  const highlights =
    typeof tagsRaw === "string" && tagsRaw.trim() !== ""
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : []

  let steps: StepPayload[] = []
  const stepsRaw = formData.get("steps_json")
  if (typeof stepsRaw === "string" && stepsRaw.trim() !== "") {
    try {
      steps = JSON.parse(stepsRaw)
    } catch {
      steps = []
    }
  }

  return {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    title_en: strOrNull(formData.get("title_en")),
    description: String(formData.get("description") ?? ""),
    description_en: strOrNull(formData.get("description_en")),
    duration: String(formData.get("duration") ?? ""),
    distance: String(formData.get("distance") ?? ""),
    difficulty: String(formData.get("difficulty") ?? ""),
    category: String(formData.get("category") ?? ""),
    image: String(formData.get("image") ?? ""),
    highlights,
    audio_guide: formData.get("audio_guide") === "on",
    offline: formData.get("offline") === "on",
    price: String(formData.get("price") ?? ""),
    steps,
  }
}

async function adminKey(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get("admin_key")?.value ?? ""
}

export async function createRoute(
  _prevState: RouteFormState | undefined,
  formData: FormData,
): Promise<RouteFormState> {
  const res = await fetch(`${API_URL}/api/admin/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} creando la ruta.` }
  }

  revalidatePath("/routes")
  revalidatePath("/admin/routes")
  redirect("/admin/routes")
}

export async function updateRoute(
  id: string,
  _prevState: RouteFormState | undefined,
  formData: FormData,
): Promise<RouteFormState> {
  const payload = payloadFromForm(formData)
  const res = await fetch(`${API_URL}/api/admin/routes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} actualizando la ruta.` }
  }

  revalidatePath("/routes")
  revalidatePath(`/routes/${payload.slug}`)
  revalidatePath("/admin/routes")
  redirect("/admin/routes")
}

export async function deleteRoute(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/routes/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Key": await adminKey() },
  })

  if (!res.ok) {
    throw new Error(`Error ${res.status} borrando la ruta.`)
  }

  revalidatePath("/routes")
  revalidatePath("/admin/routes")
}
