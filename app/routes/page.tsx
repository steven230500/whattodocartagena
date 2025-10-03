import { Header } from "@/components/navigation/header"
import { RoutesGrid } from "@/components/routes/routes-grid"
import { RoutesHero } from "@/components/routes/routes-hero"

export default function RutasPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <RoutesHero />
        <RoutesGrid />
      </main>
    </div>
  )
}
