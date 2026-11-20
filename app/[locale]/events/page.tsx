import { publicPageMetadata } from "@/lib/seo"

export const generateMetadata = () => publicPageMetadata("events")

import { Header } from "@/components/navigation/header"
import { PageHeader } from "@/components/navigation/page-header"
import { getTranslations } from "next-intl/server"
import { EventsGrid } from "@/components/events/events-grid"
import { getEvents } from "@/lib/api/events"

export const dynamic = "force-dynamic"

export default async function EventosPage() {
  const [events, t] = await Promise.all([getEvents().catch(() => []), getTranslations("pageHeaders.events")])
  const upcoming = events.filter((e) => Date.parse(e.endDate ?? e.startDate) >= new Date().setHours(0, 0, 0, 0)).length

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
          meta={[t("meta", { count: upcoming })]}
          actions={[{ label: t("plans"), href: "/plans" }]}
          image="/champeta-concert-cartagena-walls-sunset.jpg"
        />
        <EventsGrid events={events} />
      </main>
    </div>
  )
}
