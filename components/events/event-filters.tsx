"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { EVENT_TYPES } from "@/lib/map/layers"

interface EventFiltersProps {
  onFilterChange: (filters: {
    type: string
    venue: string
    dateRange: string
  }) => void
}

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const { t } = useTranslation()
  const [filters, setFilters] = useState({
    type: "all",
    venue: "all",
    dateRange: "all",
  })

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      type: "all",
      venue: "all",
      dateRange: "all",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "all")

  const venues = [
    "Plaza Santo Domingo",
    "Plaza de la Trinidad",
    "Murallas de Cartagena",
    "Teatro Heredia",
    "Centro de Convenciones",
    "Baluarte de San Francisco Javier",
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h3 className="font-semibold text-stone-darker">Filtros:</h3>

        <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Tipos</SelectItem>
            {Object.entries(EVENT_TYPES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.venue} onValueChange={(value) => updateFilter("venue", value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lugar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Lugares</SelectItem>
            {venues.map((venue) => (
              <SelectItem key={venue} value={venue}>
                {venue}
              </SelectItem>
            ))}
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
            <Badge variant="secondary" className="bg-coral/10 text-coral-dark">
              {EVENT_TYPES[filters.type as keyof typeof EVENT_TYPES]}
            </Badge>
          )}
          {filters.venue !== "all" && (
            <Badge variant="secondary" className="bg-caribbean-blue/10 text-caribbean-blue-dark">
              {filters.venue}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
