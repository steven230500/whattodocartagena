import type { Metadata } from "next"
import { getLocale } from "next-intl/server"
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
  const [event, locale] = await Promise.all([getEventBySlug(slug), getLocale()])
  if (!event) return {}

  const eventTitle = locale === "en" && event.titleEn ? event.titleEn : event.title
  const description = locale === "en" && event.descriptionEn ? event.descriptionEn : event.description
  const title = `${eventTitle} | What to do Cartagena`
  return {
    title,
    description,
    alternates: {
      canonical: `https://whattodocartagena.com/events/${slug}`,
      languages: {
        es: `https://whattodocartagena.com/events/${slug}`,
        en: `https://whattodocartagena.com/en/events/${slug}`,
      },
    },
    openGraph: { title, description, images: [event.image], type: "website" },
    twitter: { card: "summary_large_image", title, description },
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
