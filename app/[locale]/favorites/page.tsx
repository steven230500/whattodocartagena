import { getTranslations } from "next-intl/server"
import { Header } from "@/components/navigation/header"
import { CommerceGrid } from "@/components/commerce/commerce-grid"
import { LocalFavorites } from "@/components/business/local-favorites"
import { getCurrentUser } from "@/lib/api/auth"
import { getBusinesses } from "@/lib/api/businesses"
import { getFavoriteSlugs } from "@/lib/api/favorites"

export const dynamic = "force-dynamic"

/**
 * Con sesión: favoritos de la cuenta. Sin sesión: los guardados en el teléfono,
 * con la invitación a iniciar sesión para tenerlos en todos los dispositivos.
 */
export default async function FavoritesPage() {
  const [user, allBusinesses, t] = await Promise.all([
    getCurrentUser(),
    getBusinesses().catch(() => []),
    getTranslations("favorites"),
  ])

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-8 md:pt-28">
          <div className="container mx-auto px-4">
            <h1 className="mb-6 font-serif text-4xl font-bold text-foreground">{t("title")}</h1>
          </div>
          <LocalFavorites businesses={allBusinesses} />
        </main>
      </div>
    )
  }

  const favoriteSlugs = await getFavoriteSlugs()
  const favorites = allBusinesses.filter((b) => favoriteSlugs.includes(b.slug))

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8 md:pt-28">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 font-serif text-4xl font-bold text-foreground">{t("title")}</h1>
          {favorites.length === 0 && <p className="text-muted-foreground">{t("empty")}</p>}
        </div>
        <CommerceGrid commerces={favorites} favoriteSlugs={favoriteSlugs} />
      </main>
    </div>
  )
}
