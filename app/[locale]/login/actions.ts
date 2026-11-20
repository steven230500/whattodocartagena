"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { loginUser, USER_TOKEN_COOKIE } from "@/lib/api/auth"

export interface LoginFormState {
  error?: string
}

export async function login(_prevState: LoginFormState | undefined, formData: FormData): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  const { token, error } = await loginUser(email, password)
  if (error || !token) {
    return { error: error || "No se pudo iniciar sesión." }
  }

  const cookieStore = await cookies()
  cookieStore.set(USER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días, igual que el JWT
  })

  // vuelve a la página desde la que se pidió iniciar sesión (solo rutas internas)
  const next = String(formData.get("next") ?? "")
  redirect(/^\/(?!\/)[\w\-/]*$/.test(next) ? next : "/")
}
