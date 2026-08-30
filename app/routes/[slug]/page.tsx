import type { Metadata } from "next"
import { Header } from "@/components/navigation/header"
import { RoutePlayer } from "@/components/routes/route-player"
import { RouteMap } from "@/components/routes/route-map"
import { getRouteBySlug } from "@/lib/api/routes"
import { getRouteProgress } from "@/lib/api/route-progress"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface RoutePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { slug } = await params
  const route = await getRouteBySlug(slug)
  if (!route) return {}

  const title = `${route.title} | What to do Cartagena`
  return {
    title,
    description: route.description,
    alternates: { canonical: `https://whattodocartagena.com/routes/${slug}` },
    openGraph: { title, description: route.description, images: [route.image], type: "website" },
    twitter: { card: "summary_large_image", title, description: route.description },
  }
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { slug } = await params
  const route = await getRouteBySlug(slug)

  if (!route) {
    notFound()
  }

  if (route.steps.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-md">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-3">{route.title}</h1>
            <p className="text-muted-foreground">
              Todavía no hay pasos cargados para esta ruta. Volvé pronto — la estamos completando.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const initialStep = (await getRouteProgress(route.id)) ?? undefined

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <RoutePlayer route={route} routeId={route.id} initialStep={initialStep} />
          <RouteMap route={route} />
        </div>
      </main>
    </div>
  )
}
