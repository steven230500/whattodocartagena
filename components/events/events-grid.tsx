"use client"

import { useMemo, useState } from "react"
import { EventCard } from "@/components/cards/event-card"
import { EventFilters } from "@/components/events/event-filters"
import type { Event } from "@/lib/types/commerce"
import { useTranslations } from "next-intl"

interface EventsGridProps {
  events: Event[]
}

export function EventsGrid({ events }: EventsGridProps) {
  const t = useTranslations()
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [typeVenueFilters, setTypeVenueFilters] = useState({ type: "all", venue: "all" })

  const filteredEvents = useMemo(() => {
    const now = new Date()
    return (events || []).filter((event) => {
      const isUpcoming = new Date(event.startDate) >= now
      if (showUpcoming !== isUpcoming) return false
      if (typeVenueFilters.type !== "all" && event.type !== typeVenueFilters.type) return false
      if (
        typeVenueFilters.venue !== "all" &&
        !event.venue.toLowerCase().includes(typeVenueFilters.venue.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [events, showUpcoming, typeVenueFilters])

  return (
    <section className="py-16 bg-stone-warm">
      <div className="container mx-auto px-4">
        {/* Time Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setShowUpcoming(true)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                showUpcoming ? "bg-coral text-white" : "text-stone-darker hover:bg-stone-light"
              }`}
            >
              {t("events.upcoming")}
            </button>
            <button
              onClick={() => setShowUpcoming(false)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                !showUpcoming ? "bg-coral text-white" : "text-stone-darker hover:bg-stone-light"
              }`}
            >
              {t("events.past")}
            </button>
          </div>
        </div>

        <EventFilters onFilterChange={(f) => setTypeVenueFilters({ type: f.type, venue: f.venue })} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-darker text-lg">
              {showUpcoming
                ? "No hay eventos próximos cargados por ahora. Volvé pronto."
                : "No hay eventos pasados que coincidan con los filtros seleccionados."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
