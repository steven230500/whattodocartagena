"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const key = formData.get("key")

  if (typeof key !== "string" || key.length === 0 || key !== process.env.ADMIN_API_KEY) {
    return { error: "Contraseña incorrecta." }
  }

  const cookieStore = await cookies()
  cookieStore.set("admin_key", key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  redirect("/admin/businesses")
}
