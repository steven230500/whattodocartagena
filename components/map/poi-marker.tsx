"use client"

import { Crown, Utensils, Music, Camera, Store, ShoppingBag, MapPin } from "lucide-react"

interface PoiMarkerProps {
  point: any
  onClick: () => void
  layerColor: string
}

const iconMap = {
  Crown,
  Utensils,
  Music,
  Camera,
  Store,
  ShoppingBag,
  MapPin,
  Building: Crown,
  Anchor: MapPin,
  Star: Utensils,
  Heart: Utensils,
}

export function PoiMarker({ point, onClick, layerColor }: PoiMarkerProps) {
  const Icon = point.icon || MapPin

  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-all duration-200 z-10"
      style={{
        left: `${point.coordinates.x}%`,
        top: `${point.coordinates.y}%`,
        backgroundColor: layerColor,
      }}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}
