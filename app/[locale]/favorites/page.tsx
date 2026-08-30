import { redirect } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { CommerceGrid } from "@/components/commerce/commerce-grid"
import { getCurrentUser } from "@/lib/api/auth"
import { getBusinesses } from "@/lib/api/businesses"
import { getFavoriteSlugs } from "@/lib/api/favorites"

export const dynamic = "force-dynamic"

export default async function FavoritesPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const [allBusinesses, favoriteSlugs] = await Promise.all([getBusinesses(), getFavoriteSlugs()])
  const favorites = allBusinesses.filter((b) => favoriteSlugs.includes(b.slug))

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">Mis favoritos</h1>
          {favorites.length === 0 && (
            <p className="text-muted-foreground">Todavía no marcaste ningún comercio como favorito.</p>
          )}
        </div>
        <CommerceGrid commerces={favorites} favoriteSlugs={favoriteSlugs} />
      </main>
    </div>
  )
}
