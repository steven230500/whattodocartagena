"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { importFavorites } from "@/app/actions/favorites"
import { clearLocalFavorites, getLocalFavorites } from "@/lib/favorites/local-favorites"
import { useRouter } from "@/i18n/navigation"

/**
 * Si hay favoritos guardados en el teléfono y el visitante ya inició sesión,
 * los sube a su cuenta una vez y los borra del teléfono. Sin favoritos locales
 * no hace ninguna petición.
 */
export function FavoritesSync() {
  const t = useTranslations("favorites")
  const router = useRouter()

  useEffect(() => {
    const local = getLocalFavorites()
    if (local.length === 0) return
    let cancelled = false
    fetch("/api/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(async (data) => {
        if (cancelled || !data?.user) return
        const saved = await importFavorites(local)
        if (cancelled) return
        clearLocalFavorites()
        if (saved > 0) {
          toast(t("synced", { count: saved }))
          router.refresh()
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [router, t])

  return null
}
