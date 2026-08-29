"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { API_URL } from "@/lib/api/config"

export interface AchievementFormState {
  error?: string
}

interface AchievementPayload {
  code: string
  title: string
  description: string
  icon: string
  criteria_type: string
  threshold: number
}

function payloadFromForm(formData: FormData): AchievementPayload {
  return {
    code: String(formData.get("code") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    criteria_type: String(formData.get("criteria_type") ?? ""),
    threshold: Number(formData.get("threshold") ?? 0),
  }
}

async function adminKey(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get("admin_key")?.value ?? ""
}

export async function createAchievement(
  _prevState: AchievementFormState | undefined,
  formData: FormData,
): Promise<AchievementFormState> {
  const res = await fetch(`${API_URL}/api/admin/achievements`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} creando el logro.` }
  }

  revalidatePath("/achievements")
  revalidatePath("/admin/achievements")
  redirect("/admin/achievements")
}

export async function updateAchievement(
  id: string,
  _prevState: AchievementFormState | undefined,
  formData: FormData,
): Promise<AchievementFormState> {
  const res = await fetch(`${API_URL}/api/admin/achievements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} actualizando el logro.` }
  }

  revalidatePath("/achievements")
  revalidatePath("/admin/achievements")
  redirect("/admin/achievements")
}

export async function deleteAchievement(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/achievements/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Key": await adminKey() },
  })

  if (!res.ok) {
    throw new Error(`Error ${res.status} borrando el logro.`)
  }

  revalidatePath("/achievements")
  revalidatePath("/admin/achievements")
}
