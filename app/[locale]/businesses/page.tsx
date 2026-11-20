import { publicPageMetadata } from "@/lib/seo"

export const generateMetadata = () => publicPageMetadata("businesses")

import { Header } from "@/components/navigation/header"
import { PageHeader } from "@/components/navigation/page-header"
import { getTranslations } from "next-intl/server"
import { CommerceGrid } from "@/components/commerce/commerce-grid"
import { getBusinesses } from "@/lib/api/businesses"
import { getFavoriteSlugs } from "@/lib/api/favorites"

export const dynamic = "force-dynamic"

export default async function ComerciosPage() {
  const [commerces, favoriteSlugs, t] = await Promise.all([
    getBusinesses().catch(() => []),
    getFavoriteSlugs().catch(() => []),
    getTranslations("pageHeaders.businesses"),
  ])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
          meta={[t("meta", { count: commerces.length })]}
          actions={[
            { label: t("open"), href: "/map#mapa", primary: true },
            { label: t("map"), href: "/map" },
          ]}
          image="/getsemani-street-art-colorful-buildings.jpg"
        />
        <CommerceGrid commerces={commerces} favoriteSlugs={favoriteSlugs} />
      </main>
    </div>
  )
}
