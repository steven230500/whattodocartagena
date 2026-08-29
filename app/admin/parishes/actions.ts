"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { API_URL } from "@/lib/api/config"
import { parseSchedules, type SchedulePayload } from "@/lib/admin/schedules"

export interface ParishFormState {
  error?: string
}

interface ParishPayload {
  name: string
  address: string
  neighborhood: string
  phone: string | null
  schedules: SchedulePayload[]
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string" || v.trim() === "") return null
  return v.trim()
}

function payloadFromForm(formData: FormData): ParishPayload {
  return {
    name: String(formData.get("name") ?? ""),
    address: String(formData.get("address") ?? ""),
    neighborhood: String(formData.get("neighborhood") ?? ""),
    phone: strOrNull(formData.get("phone")),
    schedules: parseSchedules(String(formData.get("schedules") ?? "")),
  }
}

async function adminKey(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get("admin_key")?.value ?? ""
}

export async function createParish(
  _prevState: ParishFormState | undefined,
  formData: FormData,
): Promise<ParishFormState> {
  const res = await fetch(`${API_URL}/api/admin/parishes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} creando la parroquia.` }
  }

  revalidatePath("/masses")
  revalidatePath("/admin/parishes")
  redirect("/admin/parishes")
}

export async function updateParish(
  id: string,
  _prevState: ParishFormState | undefined,
  formData: FormData,
): Promise<ParishFormState> {
  const res = await fetch(`${API_URL}/api/admin/parishes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} actualizando la parroquia.` }
  }

  revalidatePath("/masses")
  revalidatePath("/admin/parishes")
  redirect("/admin/parishes")
}

export async function deleteParish(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/parishes/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Key": await adminKey() },
  })

  if (!res.ok) {
    throw new Error(`Error ${res.status} borrando la parroquia.`)
  }

  revalidatePath("/masses")
  revalidatePath("/admin/parishes")
}
