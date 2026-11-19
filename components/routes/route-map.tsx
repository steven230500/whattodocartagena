"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Navigation, Locate, Box } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

const RouteLeafletCanvas = dynamic(() => import("./route-leaflet-canvas"), { ssr: false })

interface RouteMapProps {
  route: {
    slug?: string
    steps: Array<{
      id: string
      title: string
      coordinates?: { lat: number; lng: number }
    }>
  }
}

export function RouteMap({ route }: RouteMapProps) {
  const t = useTranslations("city3d")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const steps = route.steps.filter(
    (s): s is typeof s & { coordinates: { lat: number; lng: number } } => s.coordinates != null,
  )

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const openDirections = () => {
    const first = steps[0]
    if (!first) return
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${first.coordinates.lat},${first.coordinates.lng}`, "_blank")
  }

  if (steps.length === 0) {
    return (
      <div className="h-[420px] lg:h-full flex items-center justify-center bg-muted/20 text-muted-foreground text-sm p-8 text-center">
        Todavía no hay ubicaciones cargadas para esta ruta.
      </div>
    )
  }

  return (
    <div className="relative h-[420px] lg:h-full bg-muted/20">
      <RouteLeafletCanvas steps={steps} userLocation={userLocation} />

      {route.slug && (
        <Link
          href={{ pathname: "/map/3d", query: { route: route.slug } }}
          className="absolute top-4 left-14 z-[1000] inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-2 text-sm font-semibold text-background shadow-lg hover:bg-foreground/90"
        >
          <Box className="h-4 w-4" aria-hidden />
          {t("open3d")}
        </Link>
      )}

      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
        <Button size="sm" variant="outline" onClick={getCurrentLocation} className="bg-white/95 backdrop-blur-sm" aria-label="Mostrar mi ubicación">
          <Locate className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 z-[1000]">
        <Button className="bg-coral hover:bg-coral-dark text-white shadow-lg" onClick={openDirections}>
          <Navigation className="w-4 h-4 mr-2" />
          Navegar
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Leyenda</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-foreground rounded-full" />
            <span>Pasos de la ruta</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-coral" />
            <span>Camino sugerido</span>
          </div>
          {userLocation && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Tu ubicación</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
