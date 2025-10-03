import { Header } from "@/components/navigation/header"
import { MassSchedulesHero } from "@/components/mass-schedules/mass-schedules-hero"
import { MassSchedulesGrid } from "@/components/mass-schedules/mass-schedules-grid"

export default function MisasPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MassSchedulesHero />
        <MassSchedulesGrid />
      </main>
    </div>
  )
}
