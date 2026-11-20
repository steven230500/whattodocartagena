import { getLocale } from "next-intl/server"
import { publicPageMetadata } from "@/lib/seo"
import { Header } from "@/components/navigation/header"
import { HomeHero } from "@/components/home/home-hero"
import { OpenNow } from "@/components/home/open-now"
import { WalkingRoutes } from "@/components/home/walking-routes"
import { ThisWeek } from "@/components/home/this-week"
import { City3DTeaser } from "@/components/home/city-3d-teaser"
import { HistoryPreview } from "@/components/sections/history-preview"
import { getBusinesses } from "@/lib/api/businesses"
import { getRoutes } from "@/lib/api/routes"
import { getEvents } from "@/lib/api/events"
import { placesFromCommerces } from "@/features/places"

export const generateMetadata = () => publicPageMetadata("")

export const dynamic = "force-dynamic"

/**
 * Inicio "qué hacer hoy" (DESIGN.md: resolver en menos de 10 s qué hacer ahora):
 * abierto ahora, rutas a pie, eventos de la semana, la ciudad en 3D y una sola franja de historia.
 * Si la API falla, cada sección se oculta en vez de romper la página.
 */
export default async function HomePage() {
  const locale = await getLocale()
  const [commerces, routes, events] = await Promise.all([
    getBusinesses().catch(() => []),
    getRoutes().catch(() => []),
    getEvents().catch(() => []),
  ])
  const now = new Date().getTime()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HomeHero />
        <OpenNow places={placesFromCommerces(commerces, locale)} />
        <WalkingRoutes routes={routes} />
        <ThisWeek events={events} now={now} />
        <City3DTeaser />
        <HistoryPreview />
      </main>
    </div>
  )
}
