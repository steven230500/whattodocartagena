import { cookies } from "next/headers"
import { API_URL } from "./config"

export interface User {
  id: string
  email: string
  role: string
  created_at: string
}

export const USER_TOKEN_COOKIE = "user_token"

export async function registerUser(email: string, password: string): Promise<{ error?: string }> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status}` }
  }
  return {}
}

export async function loginUser(email: string, password: string): Promise<{ token?: string; error?: string }> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return { error: body.error || `Error ${res.status}` }
  }
  const data = await res.json()
  return { token: data.token }
}

// getCurrentUser lee la cookie de sesión server-side y confirma contra /api/me.
// Devuelve null si no hay sesión o el token venció — nunca tira, para que las
// páginas puedan usarla sin try/catch.
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value
  if (!token) return null

  const res = await fetch(`${API_URL}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export async function getUserToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(USER_TOKEN_COOKIE)?.value ?? null
}
