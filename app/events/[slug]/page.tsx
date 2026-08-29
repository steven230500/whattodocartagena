import { Header } from "@/components/navigation/header"
import { EventDetail } from "@/components/events/event-detail"
import { getEventBySlug } from "@/lib/api/events"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface EventPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

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
