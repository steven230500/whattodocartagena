"use client"

import { useState } from "react"
import { PlanCard } from "@/components/cards/plan-card"
import { PlanFilters } from "./plan-filters"
import { plans } from "@/lib/data/plans"
import type { Plan } from "@/lib/types/plan"

export function PlansGrid() {
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>(plans)

  return (
    <section className="py-16 bg-[var(--color-stone-warm)]">
      <div className="container mx-auto px-4">
        <PlanFilters plans={plans} onFilter={setFilteredPlans} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-stone-dark)] text-lg">
              No se encontraron planes con los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
