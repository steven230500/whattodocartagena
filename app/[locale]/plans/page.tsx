import { Header } from "@/components/navigation/header"
import { PlansHero } from "@/components/plans/plans-hero"
import { PlansGrid } from "@/components/plans/plans-grid"
import { getPlans } from "@/lib/api/plans"

export const dynamic = "force-dynamic"

export default async function PlanesPage() {
  const plans = await getPlans()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PlansHero />
        <PlansGrid plans={plans} />
      </main>
    </div>
  )
}
