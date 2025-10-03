"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Music, MapPin } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useState } from "react"

export function EventsHero() {
  const { t } = useTranslation()
  const [currentLocale] = useState<"es" | "en">("es")

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/champeta-concert-cartagena-walls-sunset.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Music className="w-4 h-4 text-coral" />
            <span className="text-sm font-medium">Cultura Viva • Eventos Auténticos</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">
            {t("events.title")}
            <span className="block text-coral animate-float">Culturales</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto text-pretty">{t("events.subtitle")}</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-white px-8 py-4 text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              {t("events.upcoming")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {t("cta.viewOnMap")}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-coral mb-1">12</div>
              <div className="text-sm text-white/70">Festivales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-caribbean-blue mb-1">25</div>
              <div className="text-sm text-white/70">Conciertos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-colonial-gold mb-1">18</div>
              <div className="text-sm text-white/70">Ferias</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest-light mb-1">30</div>
              <div className="text-sm text-white/70">Eventos Gastronómicos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
