"use server"

import { cookies } from "next/headers"
import { USER_TOKEN_COOKIE } from "@/lib/api/auth"

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(USER_TOKEN_COOKIE)
}
