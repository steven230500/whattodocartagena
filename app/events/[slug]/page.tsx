import type { Metadata } from "next"
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

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return {}

  const title = `${event.title} | What to do Cartagena`
  return {
    title,
    description: event.description,
    alternates: { canonical: `https://whattodocartagena.com/events/${slug}` },
    openGraph: { title, description: event.description, images: [event.image], type: "website" },
    twitter: { card: "summary_large_image", title, description: event.description },
  }
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
