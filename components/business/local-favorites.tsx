"use client"

import { Heart } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { CommerceGrid } from "@/components/commerce/commerce-grid"
import { useLocalFavorites } from "@/lib/favorites/local-favorites"
import type { Commerce } from "@/lib/types/commerce"

/** /favorites sin sesión: lo guardado en este teléfono y la invitación a la cuenta. */
export function LocalFavorites({ businesses }: { businesses: Commerce[] }) {
  const t = useTranslations("favorites")
  const locale = useLocale()
  const slugs = useLocalFavorites()
  const favorites = businesses.filter((b) => slugs.includes(b.slug))
  const next = locale === "en" ? "/en/favorites" : "/favorites"

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-foreground/80">{t("localNotice")}</p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href={{ pathname: "/login", query: { next } }}
              className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-ink hover:bg-coral-dark"
            >
              {t("login")}
            </Link>
            <Link href="/register" className="px-1 py-2.5 text-sm font-semibold text-coral-ink hover:underline">
              {t("register")}
            </Link>
          </div>
        </div>
        {favorites.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            <Heart className="mx-auto mb-3 h-8 w-8" aria-hidden />
            <p>{t("emptyLocal")}</p>
            <Link href="/businesses" className="mt-3 inline-block font-semibold text-coral-ink hover:underline">
              {t("browse")}
            </Link>
          </div>
        )}
      </div>
      {favorites.length > 0 && <CommerceGrid commerces={favorites} favoriteSlugs={[]} />}
    </>
  )
}
