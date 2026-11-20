import { publicPageMetadata } from "@/lib/seo"

export const generateMetadata = () => publicPageMetadata("plans")

import { Header } from "@/components/navigation/header"
import { PageHeader } from "@/components/navigation/page-header"
import { getTranslations } from "next-intl/server"
import { PlansGrid } from "@/components/plans/plans-grid"
import { getPlans } from "@/lib/api/plans"

export const dynamic = "force-dynamic"

export default async function PlanesPage() {
  const [plans, t] = await Promise.all([getPlans().catch(() => []), getTranslations("pageHeaders.plans")])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHeader title={t("title")} subtitle={t("subtitle")} meta={[t("meta")]} image="/art-fair-getsemani-cartagena-street-art.jpg" />
        <PlansGrid plans={plans} />
      </main>
    </div>
  )
}
