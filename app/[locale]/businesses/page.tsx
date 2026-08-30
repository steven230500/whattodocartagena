import { Header } from "@/components/navigation/header"
import { CommerceHero } from "@/components/commerce/commerce-hero"
import { CommerceGrid } from "@/components/commerce/commerce-grid"
import { getBusinesses } from "@/lib/api/businesses"
import { getFavoriteSlugs } from "@/lib/api/favorites"

export const dynamic = "force-dynamic"

export default async function ComerciosPage() {
  const [commerces, favoriteSlugs] = await Promise.all([getBusinesses(), getFavoriteSlugs()])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CommerceHero count={commerces.length} />
        <CommerceGrid commerces={commerces} favoriteSlugs={favoriteSlugs} />
      </main>
    </div>
  )
}
