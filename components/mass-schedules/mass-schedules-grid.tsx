"use client"

import { useTranslations } from "next-intl"
import { ParishCard } from "@/components/cards/parish-card"
import type { Parish } from "@/lib/types/parish"

interface MassSchedulesGridProps {
  parishes: Parish[]
}

export function MassSchedulesGrid({ parishes }: MassSchedulesGridProps) {
  const t = useTranslations("mass")

  return (
    <section className="py-16 bg-[var(--color-stone-warm)]">
      <div className="container mx-auto px-4">
        {parishes.length === 0 && (
          <p className="mx-auto max-w-md py-12 text-center text-lg text-muted-foreground">
            {t("emptyError")}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parishes.map((parish) => (
            <ParishCard key={parish.id} parish={parish} />
          ))}
        </div>
      </div>
    </section>
  )
}
