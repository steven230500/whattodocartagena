"use server"

import { revalidatePath } from "next/cache"
import { addFavorite, removeFavorite, type ToggleFavoriteResult } from "@/lib/api/favorites"

export async function toggleFavorite(slug: string, currentlyFavorited: boolean): Promise<ToggleFavoriteResult> {
  const result = currentlyFavorited ? await removeFavorite(slug) : await addFavorite(slug)

  if (result === "ok") {
    revalidatePath("/businesses")
    revalidatePath(`/businesses/${slug}`)
    revalidatePath("/favorites")
  }

  return result
}

/**
 * Sube a la cuenta los favoritos que el visitante guardó en el teléfono antes
 * de iniciar sesión. Devuelve cuántos quedaron guardados.
 */
export async function importFavorites(slugs: string[]): Promise<number> {
  const unique = [...new Set(slugs.filter((s) => typeof s === "string" && /^[a-z0-9-]{1,120}$/.test(s)))].slice(0, 200)
  let saved = 0
  for (const slug of unique) {
    if ((await addFavorite(slug)) === "ok") saved++
  }
  if (saved > 0) {
    revalidatePath("/businesses")
    revalidatePath("/favorites")
  }
  return saved
}
