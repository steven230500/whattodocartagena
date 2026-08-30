import { Header } from "@/components/navigation/header"
import { EventsHero } from "@/components/events/events-hero"
import { EventsGrid } from "@/components/events/events-grid"
import { getEvents } from "@/lib/api/events"

export const dynamic = "force-dynamic"

export default async function EventosPage() {
  const events = await getEvents()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <EventsHero />
        <EventsGrid events={events} />
      </main>
    </div>
  )
}
