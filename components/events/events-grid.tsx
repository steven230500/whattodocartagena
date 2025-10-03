"use client"

import { useState } from "react"
import { EventCard } from "@/components/cards/event-card"
import { EventFilters } from "@/components/events/event-filters"
import { events } from "@/lib/data/events"
import type { Event } from "@/lib/types/commerce"
import { useTranslation } from "@/lib/i18n"

export function EventsGrid() {
  const { t } = useTranslation()
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events)
  const [showUpcoming, setShowUpcoming] = useState(true)

  const handleFilterChange = (filters: {
    type: string
    venue: string
    dateRange: string
  }) => {
    let filtered = events

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((event) => event.type === filters.type)
    }

    if (filters.venue && filters.venue !== "all") {
      filtered = filtered.filter((event) => event.venue.toLowerCase().includes(filters.venue.toLowerCase()))
    }

    // Filter by date range (upcoming vs past)
    const now = new Date()
    if (showUpcoming) {
      filtered = filtered.filter((event) => new Date(event.startDate) >= now)
    } else {
      filtered = filtered.filter((event) => new Date(event.startDate) < now)
    }

    setFilteredEvents(filtered)
  }

  const toggleTimeFilter = (upcoming: boolean) => {
    setShowUpcoming(upcoming)
    // Re-apply filters with new time filter
    handleFilterChange({
      type: "all",
      venue: "all",
      dateRange: upcoming ? "upcoming" : "past",
    })
  }

  return (
    <section className="py-16 bg-stone-warm">
      <div className="container mx-auto px-4">
        {/* Time Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => toggleTimeFilter(true)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                showUpcoming ? "bg-coral text-white" : "text-stone-darker hover:bg-stone-light"
              }`}
            >
              {t("events.upcoming")}
            </button>
            <button
              onClick={() => toggleTimeFilter(false)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                !showUpcoming ? "bg-coral text-white" : "text-stone-darker hover:bg-stone-light"
              }`}
            >
              {t("events.past")}
            </button>
          </div>
        </div>

        <EventFilters onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-darker text-lg">No se encontraron eventos con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </section>
  )
}
