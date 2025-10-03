import { Header } from "@/components/navigation/header"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesGrid } from "@/components/sections/features-grid"
import { HistoryPreview } from "@/components/sections/history-preview"
import { CallToAction } from "@/components/sections/call-to-action"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <HistoryPreview />
        <CallToAction />
      </main>
    </div>
  )
}
