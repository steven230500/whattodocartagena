"use client"

import { Church, MapPin, Clock } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { RampartDivider } from "@/components/ui/rampart-divider"

export function MassSchedulesHero() {
  const { t } = useTranslation()

  return (
    <section className="relative">
      <div className="bg-foreground text-stone-warm py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl flex items-start gap-4">
            <Church className="w-10 h-10 shrink-0 text-stone-warm/60 mt-1" />
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">{t("mass.title")}</h1>
              <p className="text-lg md:text-xl text-stone-warm/80 mb-8 text-pretty">{t("mass.subtitle")}</p>
              <div className="flex flex-wrap gap-6 text-sm text-stone-warm/70">
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
        </div>
      </div>
      <RampartDivider color="var(--color-stone)" />
    </section>
  )
}
