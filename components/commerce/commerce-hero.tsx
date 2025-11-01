"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Store, Filter } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useState } from "react"
import { commerces } from "@/lib/data/commerces"

export function CommerceHero() {
  const { t } = useTranslation()
  const [currentLocale] = useState<"es" | "en">("es")

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/getzemani-street-art-colorful-murals-bohemian-qu.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Store className="w-4 h-4 text-colonial-gold" />
            <span className="text-sm font-medium">Comercios Auténticos • Cultura Local</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">
            {t("commerce.title")}
            <span className="block text-colonial-gold animate-float">Locales</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto text-pretty">
            {t("commerce.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-colonial-gold hover:bg-colonial-gold-dark text-white px-8 py-4 text-lg">
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-colonial-gold mb-1">{commerces?.length || 0}+</div>
              <div className="text-sm text-white/70">Comercios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coral mb-1">30+</div>
              <div className="text-sm text-white/70">Restaurantes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-caribbean-blue mb-1">25+</div>
              <div className="text-sm text-white/70">Tiendas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest-light mb-1">15+</div>
              <div className="text-sm text-white/70">Servicios</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
