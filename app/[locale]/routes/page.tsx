import { publicPageMetadata } from "@/lib/seo"

export const generateMetadata = () => publicPageMetadata("routes")

import { Header } from "@/components/navigation/header"
import { RoutesGrid } from "@/components/routes/routes-grid"
import { PageHeader } from "@/components/navigation/page-header"
import { getTranslations } from "next-intl/server"
import { getRoutes } from "@/lib/api/routes"

export const dynamic = "force-dynamic"

export default async function RutasPage() {
  const [routes, t] = await Promise.all([getRoutes().catch(() => []), getTranslations("pageHeaders.routes")])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
          meta={[t("meta", { count: routes.length })]}
          actions={[{ label: t("cta3d"), href: "/map/3d", primary: true }]}
          image="/walking-tour-cartagena-cobblestone-streets.jpg"
        />
        <RoutesGrid routes={routes} />
      </main>
    </div>
  )
}
