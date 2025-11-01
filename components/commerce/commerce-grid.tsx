"use client"

import { useState } from "react"
import { CommerceCard } from "@/components/cards/commerce-card"
import { CommerceFilters } from "@/components/commerce/commerce-filters"
import { commerces } from "@/lib/data/commerces"
import type { Commerce } from "@/lib/types/commerce"

const safeCommerces = commerces as Commerce[]

export function CommerceGrid() {
  const [filteredCommerces, setFilteredCommerces] = useState<Commerce[]>(safeCommerces)

  const handleFilterChange = (filters: {
    type: string
    subtype: string
    neighborhood: string
    priceHint: string
  }) => {
    let filtered = safeCommerces

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((commerce) => commerce.type === filters.type)
    }

    if (filters.subtype && filters.subtype !== "all") {
      filtered = filtered.filter((commerce) => commerce.subtype === filters.subtype)
    }

    if (filters.neighborhood && filters.neighborhood !== "all") {
      filtered = filtered.filter((commerce) => commerce.barrio === filters.neighborhood)
    }

    if (filters.priceHint && filters.priceHint !== "all") {
      filtered = filtered.filter((commerce) => commerce.priceHint === filters.priceHint)
    }

    setFilteredCommerces(filtered)
  }

  return (
    <section className="py-16 bg-stone-warm">
      <div className="container mx-auto px-4">
        <CommerceFilters onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredCommerces.map((commerce) => (
            <CommerceCard key={commerce.slug} commerce={commerce} />
          ))}
        </div>

        {(filteredCommerces?.length === 0 || !filteredCommerces) && (
          <div className="text-center py-16">
            <p className="text-stone-darker text-lg">No se encontraron comercios con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </section>
  )
}
