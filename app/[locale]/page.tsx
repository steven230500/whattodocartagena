import { Header } from "@/components/navigation/header"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesGrid } from "@/components/sections/features-grid"
import { HistoryPreview } from "@/components/sections/history-preview"
import { CallToAction } from "@/components/sections/call-to-action"
import { getRoutes } from "@/lib/api/routes"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const routes = await getRoutes()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection routeCount={routes.length} />
        <FeaturesGrid />
        <HistoryPreview />
        <CallToAction />
      </main>
    </div>
  )
}
