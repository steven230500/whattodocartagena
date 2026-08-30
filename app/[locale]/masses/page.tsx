import { Header } from "@/components/navigation/header"
import { MassSchedulesHero } from "@/components/mass-schedules/mass-schedules-hero"
import { MassSchedulesGrid } from "@/components/mass-schedules/mass-schedules-grid"
import { getParishes } from "@/lib/api/parishes"

export const dynamic = "force-dynamic"

export default async function MisasPage() {
  const parishes = await getParishes()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MassSchedulesHero />
        <MassSchedulesGrid parishes={parishes} />
      </main>
    </div>
  )
}
