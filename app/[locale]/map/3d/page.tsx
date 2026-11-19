import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { Header } from "@/components/navigation/header"
import { getBusinesses } from "@/lib/api/businesses"
import { getRoutes } from "@/lib/api/routes"
import { REAL_POIS } from "@/lib/map/curated-pois"
import { LazyCityExplorer, placesFromCommerces, placesFromPois, routesForExplorer } from "@/features/city3d"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("city3d")
  return {
    title: `${t("title")} | What to do Cartagena`,
    description: t("subtitle"),
    // prototipo: fuera del índice hasta que se enlace desde la navegación
    robots: { index: false, follow: false },
  }
}

interface Map3DPageProps {
  searchParams: Promise<{ route?: string }>
}

export default async function Map3DPage({ searchParams }: Map3DPageProps) {
  const [{ route: routeSlug }, locale] = await Promise.all([searchParams, getLocale()])
  // si la API falla, la ciudad 3D igual carga (sin negocios / rutas)
  const [commerces, routes] = await Promise.all([
    getBusinesses().catch(() => []),
    getRoutes().catch(() => []),
  ])

  const places = [...placesFromPois(REAL_POIS), ...placesFromCommerces(commerces, locale)]
  const explorerRoutes = routesForExplorer(routes, locale)
  const initialRouteId = routeSlug ? explorerRoutes.find((r) => r.slug === routeSlug)?.id : undefined

  return (
    <div className="min-h-screen">
      <Header />
      <main className="md:pt-16">
        <LazyCityExplorer places={places} routes={explorerRoutes} initialRouteId={initialRouteId} />
      </main>
    </div>
  )
}
