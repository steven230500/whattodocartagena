"use client"

import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function EventsHero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
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
      <div className="relative z-10 container mx-auto px-4 py-16 text-white">
        <div className="max-w-2xl">
          <span className="inline-block text-sm font-semibold tracking-[0.2em] uppercase text-coral mb-4">
            Cultura Viva · Eventos Auténticos
          </span>

          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">
            {t("events.title")}
            <span className="block text-coral">Culturales</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-4 max-w-xl text-pretty">{t("events.subtitle")}</p>

          <p className="text-sm text-white/60 mb-8">
            12 festivales · 25 conciertos · 18 ferias · 30 eventos gastronómicos
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3">
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
        </div>
      </div>
    </section>
  )
}
