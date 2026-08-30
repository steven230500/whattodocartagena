import { Header } from "@/components/navigation/header"
import { InteractiveTimeline } from "@/components/timeline/interactive-timeline"
import { TimelineHero } from "@/components/timeline/timeline-hero"

export default function HistoriaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <TimelineHero />
        <InteractiveTimeline />
      </main>
    </div>
  )
}
