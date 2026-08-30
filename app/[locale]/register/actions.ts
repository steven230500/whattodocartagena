"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { registerUser, loginUser, USER_TOKEN_COOKIE } from "@/lib/api/auth"

export interface RegisterFormState {
  error?: string
}

export async function register(
  _prevState: RegisterFormState | undefined,
  formData: FormData,
): Promise<RegisterFormState> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  const { error: registerError } = await registerUser(email, password)
  if (registerError) {
    return { error: registerError }
  }

  // Auto-login después de registrarse, no tiene sentido pedirle 2 formularios.
  const { token, error: loginError } = await loginUser(email, password)
  if (loginError || !token) {
    return { error: loginError || "Cuenta creada, pero no se pudo iniciar sesión. Probá loguearte." }
  }

  const cookieStore = await cookies()
  cookieStore.set(USER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect("/")
}
