import { getLocale } from "next-intl/server"
import { publicPageMetadata } from "@/lib/seo"
import { Header } from "@/components/navigation/header"
import { MapHero } from "@/components/map/map-hero"
import { getBusinesses } from "@/lib/api/businesses"
import { getRoutes } from "@/lib/api/routes"
import { CURATED_POIS } from "@/lib/map/curated-pois"
import { appPlaces, PlacesMap } from "@/features/places"

export const generateMetadata = () => publicPageMetadata("map")

export const dynamic = "force-dynamic"

export default async function MapaPage() {
  const locale = await getLocale()
  // si la API falla, el mapa igual muestra los sitios curados
  const [commerces, routes] = await Promise.all([getBusinesses().catch(() => []), getRoutes().catch(() => [])])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MapHero />
        <PlacesMap places={appPlaces(CURATED_POIS, commerces, locale)} routeCount={routes.length} />
      </main>
    </div>
  )
}
