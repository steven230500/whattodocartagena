import { Header } from "@/components/navigation/header"
import { CollectiblesGrid } from "@/components/gamification/collectibles-grid"
import { CollectiblesHero } from "@/components/gamification/collectibles-hero"
import { UserProgress } from "@/components/gamification/user-progress"

export default function ColeccionablesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CollectiblesHero />
        <UserProgress />
        <CollectiblesGrid />
      </main>
    </div>
  )
}
