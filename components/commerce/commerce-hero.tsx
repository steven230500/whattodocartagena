"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Filter } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface CommerceHeroProps {
  count?: number
}

export function CommerceHero({ count = 0 }: CommerceHeroProps) {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/getsemani-street-art-colorful-buildings.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 text-white">
        <div className="max-w-2xl">
          <span className="inline-block text-sm font-semibold tracking-[0.2em] uppercase text-white/70 mb-4">
            Comercios Auténticos · Cultura Local
          </span>

          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">
            {t("commerce.title")}
            <span className="block">Locales</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-4 max-w-xl text-pretty">{t("commerce.subtitle")}</p>

          <p className="text-sm text-white/60 mb-8">
            {count}+ comercios · 30+ restaurantes · 25+ tiendas · 15+ servicios
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-white px-8 py-4 text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              {t("cta.viewOnMap")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtrar por Tipo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
