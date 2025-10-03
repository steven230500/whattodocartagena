"use client"

import { Calendar, MapPin, DollarSign } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function PlansHero() {
  const { t } = useTranslation()

  return (
    <section className="relative bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-coral-dark)] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-balance">{t("plans.title")}</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 text-pretty">{t("plans.subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{t("plans.updated")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{t("plans.allNeighborhoods")}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span>{t("plans.freeAndPaid")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
