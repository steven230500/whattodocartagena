import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { Header } from "@/components/navigation/header"
import { getBusinesses } from "@/lib/api/businesses"
import { getRoutes } from "@/lib/api/routes"
import { getRouteProgress } from "@/lib/api/route-progress"
import { saveRouteProgress } from "@/app/actions/route-progress"
import { REAL_POIS } from "@/lib/map/curated-pois"
import { LazyCityExplorer, placesFromCommerces, placesFromPois, routesForExplorer } from "@/features/city3d"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("city3d")
  const title = `${t("title")} | What to do Cartagena`
  const description = t("subtitle")
  return {
    title,
    description,
    alternates: {
      canonical: "https://whattodocartagena.com/map/3d",
      languages: {
        es: "https://whattodocartagena.com/map/3d",
        en: "https://whattodocartagena.com/en/map/3d",
      },
    },
    openGraph: { title, description, images: ["/aerial-view-of-cartagena-historic-center-with-wall.jpg"], type: "website" },
    twitter: { card: "summary_large_image", title, description },
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

  // progreso guardado por ruta (null sin sesión o sin progreso; nunca tira)
  const saved = await Promise.all(explorerRoutes.map((r) => getRouteProgress(r.id).catch(() => null)))
  const progress: Record<string, number> = {}
  explorerRoutes.forEach((r, i) => {
    if (saved[i] != null) progress[r.id] = saved[i]!
  })

  return (
    <div className="min-h-screen">
      <Header />
      <main className="md:pt-16">
        <LazyCityExplorer
          places={places}
          routes={explorerRoutes}
          initialRouteId={initialRouteId}
          progress={progress}
          saveProgress={saveRouteProgress}
        />
      </main>
    </div>
  )
}
