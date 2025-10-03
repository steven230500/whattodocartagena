import { Header } from "@/components/navigation/header"
import { EventsHero } from "@/components/events/events-hero"
import { EventsGrid } from "@/components/events/events-grid"

export default function EventosPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <EventsHero />
        <EventsGrid />
      </main>
    </div>
  )
}
