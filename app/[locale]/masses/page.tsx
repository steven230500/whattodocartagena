import { publicPageMetadata } from "@/lib/seo"

export const generateMetadata = () => publicPageMetadata("masses")

import { Header } from "@/components/navigation/header"
import { PageHeader } from "@/components/navigation/page-header"
import { getTranslations } from "next-intl/server"
import { MassSchedulesGrid } from "@/components/mass-schedules/mass-schedules-grid"
import { getParishes } from "@/lib/api/parishes"

export const dynamic = "force-dynamic"

export default async function MisasPage() {
  // si la API falla, la página muestra su estado vacío en vez de la pantalla de error
  const [parishes, t] = await Promise.all([getParishes().catch(() => []), getTranslations("pageHeaders.masses")])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHeader title={t("title")} subtitle={t("subtitle")} meta={[t("meta")]} image="/cartagena-walled-city-colonial-architecture.jpg" />
        <MassSchedulesGrid parishes={parishes} />
      </main>
    </div>
  )
}
