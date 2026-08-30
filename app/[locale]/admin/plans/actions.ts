"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { API_URL } from "@/lib/api/config"

export interface PlanFormState {
  error?: string
}

interface PlanPayload {
  title: string
  description: string
  type: string
  price: string
  price_amount: string | null
  date: string
  time: string
  location: string
  neighborhood: string
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string" || v.trim() === "") return null
  return v.trim()
}

function payloadFromForm(formData: FormData): PlanPayload {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    type: String(formData.get("type") ?? ""),
    price: String(formData.get("price") ?? "free"),
    price_amount: strOrNull(formData.get("priceAmount")),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    location: String(formData.get("location") ?? ""),
    neighborhood: String(formData.get("neighborhood") ?? ""),
  }
}

async function adminKey(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get("admin_key")?.value ?? ""
}

export async function createPlan(
  _prevState: PlanFormState | undefined,
  formData: FormData,
): Promise<PlanFormState> {
  const res = await fetch(`${API_URL}/api/admin/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} creando el plan.` }
  }

  revalidatePath("/plans")
  revalidatePath("/admin/plans")
  redirect("/admin/plans")
}

export async function updatePlan(
  id: string,
  _prevState: PlanFormState | undefined,
  formData: FormData,
): Promise<PlanFormState> {
  const res = await fetch(`${API_URL}/api/admin/plans/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Key": await adminKey() },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} actualizando el plan.` }
  }

  revalidatePath("/plans")
  revalidatePath("/admin/plans")
  redirect("/admin/plans")
}

export async function deletePlan(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/plans/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Key": await adminKey() },
  })

  if (!res.ok) {
    throw new Error(`Error ${res.status} borrando el plan.`)
  }

  revalidatePath("/plans")
  revalidatePath("/admin/plans")
}
