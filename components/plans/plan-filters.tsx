"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/lib/i18n"
import type { Plan } from "@/lib/types/plan"

interface PlanFiltersProps {
  plans: Plan[]
  onFilter: (filtered: Plan[]) => void
}

export function PlanFilters({ plans, onFilter }: PlanFiltersProps) {
  const { t } = useTranslation()
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedPrice, setSelectedPrice] = useState<string>("all")

  const handleFilter = (type: string, price: string) => {
    let filtered = plans

    if (type !== "all") {
      filtered = filtered.filter((plan) => plan.type === type)
    }

    if (price !== "all") {
      filtered = filtered.filter((plan) => plan.price === price)
    }

    onFilter(filtered)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    handleFilter(value, selectedPrice)
  }

  const handlePriceChange = (value: string) => {
    setSelectedPrice(value)
    handleFilter(selectedType, value)
  }

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select value={selectedType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("plans.filters.type")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("plans.filters.all")}</SelectItem>
          <SelectItem value="cultural">{t("plans.types.cultural")}</SelectItem>
          <SelectItem value="gastronomic">{t("plans.types.gastronomic")}</SelectItem>
          <SelectItem value="outdoor">{t("plans.types.outdoor")}</SelectItem>
          <SelectItem value="nightlife">{t("plans.types.nightlife")}</SelectItem>
          <SelectItem value="shopping">{t("plans.types.shopping")}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedPrice} onValueChange={handlePriceChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("plans.filters.price")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("plans.filters.all")}</SelectItem>
          <SelectItem value="free">{t("plans.price.free")}</SelectItem>
          <SelectItem value="paid">{t("plans.price.paid")}</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => {
          setSelectedType("all")
          setSelectedPrice("all")
          onFilter(plans)
        }}
      >
        {t("common.clearFilters")}
      </Button>
    </div>
  )
}
