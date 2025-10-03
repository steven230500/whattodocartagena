"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navigation, Locate, Layers } from "lucide-react"

interface RouteMapProps {
  route: {
    steps: Array<{
      id: number
      title: string
      coordinates: { lat: number; lng: number }
    }>
  }
}

export function RouteMap({ route }: RouteMapProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapView, setMapView] = useState<"satellite" | "street">("street")

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  return (
    <div className="relative h-full bg-muted/20">
      {/* Map Container */}
      <div className="h-full relative">
        {/* Placeholder Map */}
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/stylized-map-of-cartagena-historic-center-with-str.jpg')`,
          }}
        >
          {/* Route Points */}
          {route.steps.map((step, index) => (
            <div
              key={step.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${45 + index * 5}%`,
                top: `${35 + index * 8}%`,
              }}
            >
              <div className="bg-coral text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                {index + 1}
              </div>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium shadow-lg whitespace-nowrap">
                {step.title}
              </div>
            </div>
          ))}

          {/* Current Location */}
          {currentLocation && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg" />
            </div>
          )}

          {/* Route Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 45% 35% Q 50% 43% 50% 43% Q 55% 51% 55% 51% Q 60% 59% 60% 59%"
              stroke="#ff6b47"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button size="sm" variant="outline" onClick={getCurrentLocation} className="bg-white/95 backdrop-blur-sm">
            <Locate className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMapView(mapView === "street" ? "satellite" : "street")}
            className="bg-white/95 backdrop-blur-sm"
          >
            <Layers className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Button */}
        <div className="absolute bottom-4 right-4">
          <Button className="bg-coral hover:bg-coral-dark text-white shadow-lg">
            <Navigation className="w-4 h-4 mr-2" />
            Navegar
          </Button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Leyenda</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-coral rounded-full" />
              <span>Pasos de la ruta</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-coral" />
              <span>Camino sugerido</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Tu ubicación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
