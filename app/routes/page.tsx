import { Header } from "@/components/navigation/header"
import { RoutesGrid } from "@/components/routes/routes-grid"
import { RoutesHero } from "@/components/routes/routes-hero"
import { getRoutes } from "@/lib/api/routes"

export const dynamic = "force-dynamic"

export default async function RutasPage() {
  const routes = await getRoutes()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <RoutesHero />
        <RoutesGrid routes={routes} />
      </main>
    </div>
  )
}
