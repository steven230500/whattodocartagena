"use client"

import { ParishCard } from "@/components/cards/parish-card"
import { parishes } from "@/lib/data/parishes"

export function MassSchedulesGrid() {
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
