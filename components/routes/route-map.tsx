"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Box, ExternalLink, Locate } from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { loadStreetRouter, walkingMinutes, type WalkingRoute } from "@/features/city3d"
import { googleMapsPlaceUrl, googleMapsWalkingRouteUrl } from "@/lib/maps/google-maps"

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

type LocatedStep = { id: string; title: string; coordinates: { lat: number; lng: number } }

export function RouteMap({ route }: RouteMapProps) {
  const t = useTranslations("city3d")
  const tr = useTranslations("routePlayer.map")
  const format = useFormatter()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [walk, setWalk] = useState<WalkingRoute | null>(null)

  const steps = useMemo(
    () => route.steps.filter((s): s is typeof s & LocatedStep => s.coordinates != null),
    [route.steps],
  )

  // el camino por calles reales (mismo grafo de OSM que la ciudad 3D); mientras
  // carga, o si falla, queda la línea recta punteada entre paradas
  useEffect(() => {
    if (steps.length < 2) return
    let alive = true
    loadStreetRouter()
      .then((router) => {
        if (alive) setWalk(router.route(steps.map((s) => s.coordinates)))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [steps])

  const getCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => console.error("Error getting location:", error),
    )
  }

  if (steps.length === 0) {
    return (
      <div className="h-[420px] lg:h-full flex items-center justify-center bg-muted/20 text-muted-foreground text-sm p-8 text-center">
        {tr("emptyLocations")}
      </div>
    )
  }

  const googleUrl = googleMapsWalkingRouteUrl(steps.map((s) => s.coordinates))!
  const distance =
    walk && walk.meters >= 1000
      ? `${format.number(walk.meters / 1000, { maximumFractionDigits: 1 })} km`
      : walk
        ? `${format.number(Math.round(walk.meters / 10) * 10)} m`
        : null

  return (
    <div className="relative h-[480px] lg:h-full bg-muted/20" data-route-map>
      <RouteLeafletCanvas
        steps={steps}
        path={walk?.path ?? null}
        userLocation={userLocation}
        placeUrl={googleMapsPlaceUrl}
        placeLabel={tr("openStop")}
      />

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
        <Button size="sm" variant="outline" onClick={getCurrentLocation} className="bg-white/95 backdrop-blur-sm" aria-label={tr("showMyLocation")}>
          <Locate className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute inset-x-3 bottom-3 z-[1000] flex flex-col gap-3 rounded-xl bg-background/95 p-3 shadow-lg backdrop-blur-sm sm:inset-x-4 sm:bottom-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-sm" aria-live="polite">
          {walk && distance ? (
            <>
              <p className="font-semibold tabular-nums" data-walk-summary>
                {tr("walkSummary", { distance, minutes: walkingMinutes(walk.meters) })}
              </p>
              <p className="text-xs text-foreground/70">{tr("byStreets", { count: steps.length })}</p>
            </>
          ) : (
            <p className="font-semibold">{tr("stops", { count: steps.length })}</p>
          )}
        </div>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-coral px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-coral-dark active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {steps.length > 1 ? tr("googleRoute") : tr("googleDirections")}
          <ExternalLink className="h-4 w-4" aria-hidden />
          <span className="sr-only">{tr("newTab")}</span>
        </a>
      </div>
    </div>
  )
}
