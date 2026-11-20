"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react"

const PERIOD_META = [
  {
    key: "founding",
    year: "1533",
    image: "/aerial-view-of-cartagena-historic-center-with-wall.jpg",
  },
  {
    key: "walls",
    year: "1586-1741",
    image: "/cartagena-colonial-walls-construction-fortress.jpg",
  },
  {
    key: "independence",
    year: "1811",
    image: "/cartagena-independence-1811-heroic-city.jpg",
  },
  {
    key: "unesco",
    year: "1984",
    image: "/cartagena-unesco-world-heritage-historic-center.jpg",
  },
] as const

export function HistoryPreview() {
  const t = useTranslations("history.preview")
  const [currentPeriod, setCurrentPeriod] = useState(0)

  const historicalPeriods = PERIOD_META.map((p) => ({
    ...p,
    title: t(`periods.${p.key}.title`),
    description: t(`periods.${p.key}.description`),
  }))

  const nextPeriod = () => {
    setCurrentPeriod((prev) => (prev + 1) % historicalPeriods.length)
  }

  const prevPeriod = () => {
    setCurrentPeriod((prev) => (prev - 1 + historicalPeriods.length) % historicalPeriods.length)
  }

  const current = historicalPeriods[currentPeriod]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">{t("title")}</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t("subtitle")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border border-border shadow-none">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 lg:h-96">
                <img
                  src={current.image || "/placeholder.svg"}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                {/* Year Badge — historia/patrimonio = colonial-gold, rol fijo */}
                <div className="absolute top-4 left-4 bg-colonial-gold text-ink px-4 py-2 rounded-full font-bold text-lg">
                  {current.year}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{t("periodLabel")}</span>
                </div>

                <h3 className="font-serif text-3xl font-bold text-foreground mb-6">{current.title}</h3>

                <p className="text-lg text-muted-foreground mb-8 text-pretty">{current.description}</p>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={prevPeriod} className="w-10 h-10 p-0 bg-transparent" aria-label={t("prevPeriod")}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextPeriod} className="w-10 h-10 p-0 bg-transparent" aria-label={t("nextPeriod")}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    {historicalPeriods.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPeriod(index)}
                        aria-label={t("periodOf", { current: index + 1, total: historicalPeriods.length })}
                        aria-current={index === currentPeriod ? "step" : undefined}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentPeriod ? "bg-coral w-8" : "bg-muted-foreground/30"
                        } text-ink`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-ink px-8">
              <MapPin className="w-5 h-5 mr-2" />
              {t("exploreTimeline")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
