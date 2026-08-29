"use client"

import { ParishCard } from "@/components/cards/parish-card"
import type { Parish } from "@/lib/types/parish"

interface MassSchedulesGridProps {
  parishes: Parish[]
}

export function MassSchedulesGrid({ parishes }: MassSchedulesGridProps) {
  return (
    <section className="py-16 bg-[var(--color-stone-warm)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parishes.map((parish) => (
            <ParishCard key={parish.id} parish={parish} />
          ))}
        </div>
      </div>
    </section>
  )
}
