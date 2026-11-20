"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Crown, Sword, Flag, Building } from "lucide-react"

const TIMELINE_EVENT_META = [
  {
    id: 1,
    key: "founding",
    year: "1533",
    image: "/aerial-view-of-cartagena-historic-center-with-wall.jpg",
    icon: Crown,
  },
  {
    id: 2,
    key: "walls",
    year: "1586-1741",
    image: "/cartagena-colonial-walls-construction-fortress.jpg",
    icon: Building,
  },
  {
    id: 3,
    key: "siege1741",
    year: "1741",
    image: "/cartagena-city-walls-fortifications.jpg",
    icon: Sword,
  },
  {
    id: 4,
    key: "independence",
    year: "1811",
    image: "/cartagena-independence-1811-heroic-city.jpg",
    icon: Flag,
  },
  {
    id: 5,
    key: "morillo",
    year: "1815-1821",
    image: "/castillo-san-felipe-fortress-cartagena.jpg",
    icon: Users,
  },
  {
    id: 6,
    key: "unesco",
    year: "1984",
    image: "/cartagena-unesco-world-heritage-historic-center.jpg",
    icon: Building,
  },
] as const

export function InteractiveTimeline() {
  const t = useTranslations("timeline")
  const [activeEvent, setActiveEvent] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  const timelineEvents = TIMELINE_EVENT_META.map((item) => ({
    ...item,
    title: t(`events.${item.key}.title`),
    subtitle: t(`events.${item.key}.subtitle`),
    description: t(`events.${item.key}.description`),
    category: t(`events.${item.key}.category`),
    keyFacts: [
      t(`events.${item.key}.fact1`),
      t(`events.${item.key}.fact2`),
      t(`events.${item.key}.fact3`),
    ],
  }))

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return

      const rect = timelineRef.current.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
      setScrollProgress(progress)

      // Update active event based on scroll position
      const eventIndex = Math.floor(progress * TIMELINE_EVENT_META.length)
      setActiveEvent(Math.min(eventIndex, TIMELINE_EVENT_META.length - 1))
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={timelineRef} className="py-20 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t("subtitle")}
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex flex-wrap gap-2 mb-12">
          {timelineEvents.map((event, index) => (
            <Button
              key={event.id}
              variant={activeEvent === index ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveEvent(index)}
              className={activeEvent === index ? "bg-colonial-gold hover:bg-colonial-gold-dark text-ink" : ""}
            >
              {event.year}
            </Button>
          ))}
        </div>

        {/* Main Timeline Content */}
        <div className="max-w-6xl mx-auto">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon
            const isActive = activeEvent === index

            return (
              <div
                key={event.id}
                id={`hito-${event.key}`}
                className="mb-20 scroll-mt-24"
              >
                {/* todo el contenido se lee igual; el hito activo solo se marca con el borde */}
                <Card className={`overflow-hidden border shadow-none transition-colors duration-300 ${isActive ? "border-coral ring-2 ring-coral/20" : "border-border"}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Content */}
                    <CardContent className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                      <div className="flex items-center space-x-4 mb-6">
                        <Icon className="w-8 h-8 text-colonial-gold shrink-0" />
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {event.category}
                          </Badge>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">{event.year}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-serif text-3xl font-bold text-foreground mb-2">{event.title}</h3>

                      <p className="text-lg text-coral-ink font-medium mb-4">{event.subtitle}</p>

                      <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">{event.description}</p>

                      {/* Key Facts */}
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-foreground mb-3">{t("keyFacts")}</h4>
                        {event.keyFacts.map((fact, factIndex) => (
                          <div key={factIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-coral mt-2 flex-shrink-0 text-ink" />
                            <p className="text-sm text-muted-foreground">{fact}</p>
                          </div>
                        ))}
                      </div>

                      <Button className="bg-colonial-gold hover:bg-colonial-gold-dark text-ink self-start">
                        <MapPin className="w-4 h-4 mr-2" />
                        {t("viewOnMap")}
                      </Button>
                    </CardContent>

                    {/* Image */}
                    <div className="relative h-64 lg:h-96 order-1 lg:order-2">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

                      {/* Year Badge */}
                      <div className="absolute top-4 right-4 bg-colonial-gold text-ink px-4 py-2 rounded-full font-bold text-xl">
                        {event.year}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Progress Indicator */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
          <div className="w-1 h-32 bg-muted rounded-full overflow-hidden">
            <div
              className="w-full bg-coral transition-all duration-300 rounded-full text-ink"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
