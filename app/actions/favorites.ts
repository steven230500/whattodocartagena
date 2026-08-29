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
