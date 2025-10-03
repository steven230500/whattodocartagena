"use client"

import { Church, MapPin, Clock } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function MassSchedulesHero() {
  const { t } = useTranslation()

  return (
    <section className="relative bg-gradient-to-br from-[var(--color-caribbean-blue)] to-[var(--color-caribbean-blue-dark)] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Church className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-balance">{t("mass.title")}</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 text-pretty">{t("mass.subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{t("mass.updated")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{t("mass.mainParishes")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
