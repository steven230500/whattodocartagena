import { Header } from "@/components/navigation/header"
import { InteractiveMap } from "@/components/map/interactive-map"
import { MapHero } from "@/components/map/map-hero"

export default function MapaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MapHero />
        <InteractiveMap />
      </main>
    </div>
  )
}
