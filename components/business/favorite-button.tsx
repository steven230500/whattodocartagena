"use client"

import { useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { toggleFavorite } from "@/app/actions/favorites"
import { toggleLocalFavorite, useLocalFavorites } from "@/lib/favorites/local-favorites"
import { useRouter } from "@/i18n/navigation"

interface FavoriteButtonProps {
  slug: string
  initialFavorited: boolean
  className?: string
}

/**
 * Con cuenta, el favorito se guarda en el servidor. Sin cuenta, se guarda en el
 * teléfono y se avisa que al iniciar sesión pasa a la cuenta (antes mandaba a
 * un login sin explicación).
 */
export function FavoriteButton({ slug, initialFavorited, className = "" }: FavoriteButtonProps) {
  const t = useTranslations("favorites")
  const local = useLocalFavorites()
  // estado de servidor cuando hay sesión; null = sin sesión o todavía sin saberlo
  const [server, setServer] = useState<boolean | null>(initialFavorited ? true : null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const favorited = server ?? local.includes(slug)

  return (
    <button
      type="button"
      aria-label={favorited ? t("remove") : t("add")}
      aria-pressed={favorited}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault()
        const before = server
        const next = !favorited
        if (before !== null) setServer(next) // optimista con sesión
        startTransition(async () => {
          const result = await toggleFavorite(slug, favorited)
          if (result === "unauthorized") {
            setServer(null)
            const saved = toggleLocalFavorite(slug)
            toast(saved ? t("savedLocal") : t("removedLocal"), {
              description: saved ? t("savedLocalHint") : undefined,
              action: saved ? { label: t("seeAll"), onClick: () => router.push("/favorites") } : undefined,
            })
            return
          }
          if (result === "error") {
            setServer(before) // revierte
            toast.error(t("error"))
            return
          }
          setServer(next)
        })
      }}
      className={`inline-flex items-center justify-center rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white disabled:opacity-50 ${className}`}
    >
      <Heart className={`h-4 w-4 ${favorited ? "fill-coral text-coral" : "text-stone-darker"}`} />
    </button>
  )
}
