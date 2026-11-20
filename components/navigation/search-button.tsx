"use client"

import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export function SearchButton() {
  const t = useTranslations("nav")
  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Search button clicked - search functionality to be implemented")
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSearch} className="flex items-center gap-2">
      <Search className="w-4 h-4" />
      <span className="hidden sm:inline text-sm">{t("search")}</span>
    </Button>
  )
}
