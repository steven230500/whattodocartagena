import { publicPageMetadata } from "@/lib/seo"

export const generateMetadata = () => publicPageMetadata("history")

import { Header } from "@/components/navigation/header"
import { HistoryChapters } from "@/components/timeline/history-chapters"
import { TimelineHero } from "@/components/timeline/timeline-hero"

export default function HistoriaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <TimelineHero />
        <HistoryChapters />
      </main>
    </div>
  )
}
