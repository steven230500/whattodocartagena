import { Header } from "@/components/navigation/header"
import { PlansHero } from "@/components/plans/plans-hero"
import { PlansGrid } from "@/components/plans/plans-grid"

export default function PlanesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PlansHero />
        <PlansGrid />
      </main>
    </div>
  )
}
