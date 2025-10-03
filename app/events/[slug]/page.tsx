import { Header } from "@/components/navigation/header"
import { EventDetail } from "@/components/events/event-detail"
import { events } from "@/lib/data/events"
import { notFound } from "next/navigation"

interface EventPageProps {
  params: {
    slug: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const event = events.find((e) => e.slug === params.slug)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <EventDetail event={event} />
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }))
}
