"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { COMMERCE_TYPES, NEIGHBORHOODS } from "@/lib/map/layers"

interface MapFiltersProps {
  onFilterChange: (filters: {
    type: string
    subtype: string
    neighborhood: string
    openNow: boolean
  }) => void
}

export function MapFilters({ onFilterChange }: MapFiltersProps) {
  const { t } = useTranslation()
  const [filters, setFilters] = useState({
    type: "all",
    subtype: "all",
    neighborhood: "all",
    openNow: false,
  })

  const updateFilter = (key: string, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      type: "all",
      subtype: "all",
      neighborhood: "all",
      openNow: false,
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.type !== "all" || filters.subtype !== "all" || filters.neighborhood !== "all" || filters.openNow

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h3 className="font-semibold text-stone-darker">Filtros del Mapa:</h3>

        <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Tipos</SelectItem>
            {Object.entries(COMMERCE_TYPES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.neighborhood} onValueChange={(value) => updateFilter("neighborhood", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Barrio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Barrios</SelectItem>
            {NEIGHBORHOODS.map((neighborhood) => (
              <SelectItem key={neighborhood} value={neighborhood}>
                {neighborhood}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch
            id="open-now"
            checked={filters.openNow}
            onCheckedChange={(checked) => updateFilter("openNow", checked)}
          />
          <Label htmlFor="open-now" className="text-sm">
            Abierto ahora
          </Label>
        </div>

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
          {filters.openNow && (
            <Badge variant="secondary" className="bg-forest/10 text-forest-dark">
              Abierto ahora
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
