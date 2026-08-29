"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { toggleFavorite } from "@/app/actions/favorites"

interface FavoriteButtonProps {
  slug: string
  initialFavorited: boolean
  className?: string
}

export function FavoriteButton({ slug, initialFavorited, className = "" }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      type="button"
      aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault()
        const next = !favorited
        setFavorited(next) // optimista
        startTransition(async () => {
          const result = await toggleFavorite(slug, favorited)
          if (result === "unauthorized") {
            router.push("/login")
            return
          }
          if (result === "error") {
            setFavorited(!next) // revierte si falló
          }
        })
      }}
      className={`inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white p-2 shadow-sm transition-colors disabled:opacity-50 ${className}`}
    >
      <Heart className={`w-4 h-4 ${favorited ? "fill-coral text-coral" : "text-stone-darker"}`} />
    </button>
  )
}
