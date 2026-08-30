"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { API_URL } from "@/lib/api/config"
import { USER_TOKEN_COOKIE } from "@/lib/api/auth"

export interface MyBusinessFormState {
  error?: string
}

interface MyBusinessPayload {
  description: string
  hours: string | null
  price_hint: string | null
  price_typical_note: string | null
  phone: string | null
  web: string | null
  email: string | null
  instagram: string | null
  image: string
  tags: string[]
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string" || v.trim() === "") return null
  return v.trim()
}

function payloadFromForm(formData: FormData): MyBusinessPayload {
  return {
    description: String(formData.get("description") ?? ""),
    hours: strOrNull(formData.get("hours")),
    price_hint: strOrNull(formData.get("price_hint")),
    price_typical_note: strOrNull(formData.get("price_typical_note")),
    phone: strOrNull(formData.get("phone")),
    web: strOrNull(formData.get("web")),
    email: strOrNull(formData.get("email")),
    instagram: strOrNull(formData.get("instagram")),
    image: String(formData.get("image") ?? ""),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  }
}

export async function updateMyBusiness(
  id: string,
  _prevState: MyBusinessFormState | undefined,
  formData: FormData,
): Promise<MyBusinessFormState> {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value ?? ""

  const res = await fetch(`${API_URL}/api/me/businesses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payloadFromForm(formData)),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status} actualizando tu negocio.` }
  }

  revalidatePath("/my-business")
  revalidatePath(`/my-business/${id}/edit`)
  redirect("/my-business")
}
