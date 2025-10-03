"use client"

import { Button } from "@/components/ui/button"
import { Crown, Utensils, Music, Camera, Store, ShoppingBag } from "lucide-react"
import type { MapLayer } from "@/lib/types/commerce"

interface LayerToggleProps {
  layers: MapLayer[]
  onToggle: (layerId: string) => void
}

const iconMap = {
  crown: Crown,
  utensils: Utensils,
  music: Music,
  camera: Camera,
  store: Store,
  bag: ShoppingBag,
}

export function LayerToggle({ layers, onToggle }: LayerToggleProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {layers.map((layer) => {
        const Icon = iconMap[layer.icon as keyof typeof iconMap] || ShoppingBag
        const isActive = layer.active

        return (
          <Button
            key={layer.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => onToggle(layer.id)}
            className={`${isActive ? "text-white hover:opacity-90" : ""} flex items-center space-x-2`}
            style={{
              backgroundColor: isActive ? layer.color : undefined,
              borderColor: layer.color,
            }}
          >
            <Icon className="w-4 h-4" />
            <span>{layer.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
