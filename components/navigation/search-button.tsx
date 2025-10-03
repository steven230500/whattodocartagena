"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchButton() {
  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("[v0] Search button clicked - search functionality to be implemented")
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSearch} className="flex items-center gap-2">
      <Search className="w-4 h-4" />
      <span className="hidden sm:inline text-sm">Buscar</span>
    </Button>
  )
}
