"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Navigation, Share2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { Event } from "@/lib/types/commerce"
import { EVENT_TYPES } from "@/lib/map/layers"
import Link from "next/link"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const { t } = useTranslation()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    })
  }

  const formatDateRange = () => {
    const startDate = formatDate(event.startDate)
    if (event.endDate) {
      const endDate = formatDate(event.endDate)
      return `${startDate} - ${endDate}`
    }
    return startDate
  }

  const isUpcoming = new Date(event.startDate) > new Date()

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-coral text-white">{EVENT_TYPES[event.type]}</Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-white/90 text-stone-darker border-white/50">
            <Calendar className="w-3 h-3 mr-1" />
            {isUpcoming ? "Próximo" : "Pasado"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-serif text-xl font-bold text-stone-darker group-hover:text-coral transition-colors">
            {event.title}
          </h3>
        </div>
        <div className="space-y-1">
          <div className="flex items-center text-stone-dark text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDateRange()}</span>
          </div>
          <div className="flex items-center text-stone-dark text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{event.venue}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-stone-dark text-sm mb-4 line-clamp-2">{event.description}</p>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-stone-light text-stone-darker">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-stone-light text-stone-darker">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/eventos/${event.slug}`} className="flex-1">
            <Button className="w-full bg-coral hover:bg-coral-dark text-white text-sm">{t("cta.viewDetails")}</Button>
          </Link>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Navigation className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
