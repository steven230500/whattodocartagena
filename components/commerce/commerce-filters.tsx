"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { COMMERCE_TYPES, NEIGHBORHOODS } from "@/lib/map/layers"

interface CommerceFiltersProps {
  onFilterChange: (filters: {
    type: string
    subtype: string
    neighborhood: string
    priceHint: string
  }) => void
}

export function CommerceFilters({ onFilterChange }: CommerceFiltersProps) {
  const { t } = useTranslation()
  const [filters, setFilters] = useState({
    type: "all",
    subtype: "all",
    neighborhood: "all",
    priceHint: "all",
  })

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      type: "all",
      subtype: "all",
      neighborhood: "all",
      priceHint: "all",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "all")

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h3 className="font-semibold text-stone-darker">Filtros:</h3>

        <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("commerce.filters.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("commerce.filters.all")}</SelectItem>
            {Object.entries(COMMERCE_TYPES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.neighborhood} onValueChange={(value) => updateFilter("neighborhood", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("commerce.filters.neighborhood")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("commerce.filters.all")}</SelectItem>
            {NEIGHBORHOODS.map((neighborhood) => (
              <SelectItem key={neighborhood} value={neighborhood}>
                {neighborhood}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priceHint} onValueChange={(value) => updateFilter("priceHint", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("commerce.filters.price")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("commerce.filters.all")}</SelectItem>
            <SelectItem value="$">$ - Económico</SelectItem>
            <SelectItem value="$$">$$ - Moderado</SelectItem>
            <SelectItem value="$$$">$$$ - Premium</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Limpiar Filtros
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.type !== "all" && (
            <Badge variant="secondary" className="bg-colonial-gold/10 text-colonial-gold-dark">
              {COMMERCE_TYPES[filters.type as keyof typeof COMMERCE_TYPES]}
            </Badge>
          )}
          {filters.neighborhood !== "all" && (
            <Badge variant="secondary" className="bg-caribbean-blue/10 text-caribbean-blue-dark">
              {filters.neighborhood}
            </Badge>
          )}
          {filters.priceHint !== "all" && (
            <Badge variant="secondary" className="bg-coral/10 text-coral-dark">
              {filters.priceHint}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
