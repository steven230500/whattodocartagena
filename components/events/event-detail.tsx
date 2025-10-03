"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Clock, Navigation, Share2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { Event } from "@/lib/types/commerce"
import { EVENT_TYPES } from "@/lib/map/layers"

interface EventDetailProps {
  event: Event
}

export function EventDetail({ event }: EventDetailProps) {
  const { t } = useTranslation()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  return (
    <div className="min-h-screen bg-stone-warm">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${event.image}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-16">
          <div className="text-white">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-coral text-white">{EVENT_TYPES[event.type]}</Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(event.startDate) > new Date() ? "Próximo" : "Pasado"}
              </Badge>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>

            <div className="flex items-center text-white/80 mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.venue}</span>
            </div>

            <div className="flex items-center text-white/80 mb-4">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDateRange()}</span>
            </div>

            <p className="text-xl text-white/90 max-w-2xl">{event.description}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="font-serif text-2xl font-bold mb-6 text-stone-darker">Sobre el Evento</h2>

                  <div className="prose prose-stone max-w-none">
                    <p className="text-stone-dark leading-relaxed">{event.content || event.description}</p>
                  </div>

                  {event.tags.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-semibold text-stone-darker mb-3">Categorías:</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-stone-light text-stone-darker">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-stone-darker mb-4">Información del Evento</h3>

                  <div className="space-y-3">
                    <div className="flex items-start text-stone-dark">
                      <Calendar className="w-4 h-4 mr-3 text-stone-darker mt-1" />
                      <div>
                        <div className="font-medium">Fecha</div>
                        <div className="text-sm">{formatDateRange()}</div>
                      </div>
                    </div>

                    <div className="flex items-start text-stone-dark">
                      <MapPin className="w-4 h-4 mr-3 text-stone-darker mt-1" />
                      <div>
                        <div className="font-medium">Lugar</div>
                        <div className="text-sm">{event.venue}</div>
                      </div>
                    </div>

                    <div className="flex items-start text-stone-dark">
                      <Clock className="w-4 h-4 mr-3 text-stone-darker mt-1" />
                      <div>
                        <div className="font-medium">Tipo</div>
                        <div className="text-sm">{EVENT_TYPES[event.type]}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button className="w-full bg-coral hover:bg-coral-dark text-white">
                      <MapPin className="w-4 h-4 mr-2" />
                      {t("cta.viewOnMap")}
                    </Button>

                    <Button variant="outline" className="w-full bg-transparent">
                      <Navigation className="w-4 h-4 mr-2" />
                      {t("cta.getDirections")}
                    </Button>

                    <Button variant="outline" className="w-full bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartir Evento
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related Commerce */}
              {event.relatedCommerce && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-stone-darker mb-4">Comercio Relacionado</h3>
                    <Button variant="outline" className="w-full bg-transparent">
                      Ver Comercio
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
