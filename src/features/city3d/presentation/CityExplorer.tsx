"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Compass, Map as MapIcon, RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { CityModel } from "../domain/city-model"
import type { ExplorerPlace, ExplorerRoute } from "../domain/explorer"
import { cartagenaDateAt, cartagenaMinutes, paletteFor, sunPosition } from "../domain/sun"
import { loadCity } from "../infrastructure/load-city"
import { ExplorerProvider, useExplorer, type SaveProgress } from "./state"
import { Crenellation, ExplorerPanel } from "./ui/ExplorerPanel"
import { SelectionCard } from "./ui/SelectionCard"
import { MapOverlay } from "./ui/MapOverlay"
import { TimeDock } from "./ui/TimeDock"
import { cn } from "@/lib/utils"

const CityCanvas = dynamic(() => import("./scene/CityCanvas"), { ssr: false })

export interface CityExplorerProps {
  places: ExplorerPlace[]
  routes: ExplorerRoute[]
  initialRouteId?: string
  /** parada guardada por ruta (usuario con sesión) */
  progress?: Record<string, number>
  /** server action para guardar el avance; sin sesión no hace nada */
  saveProgress?: SaveProgress
}

type Status = { kind: "loading" } | { kind: "ready"; model: CityModel } | { kind: "error" } | { kind: "no-webgl" }

function hasWebGL() {
  try {
    const c = document.createElement("canvas")
    return !!(c.getContext("webgl2") || c.getContext("webgl"))
  } catch {
    return false
  }
}

export default function CityExplorer({ places, routes, initialRouteId, progress, saveProgress }: CityExplorerProps) {
  const t = useTranslations("city3d")
  // componente solo de cliente (ssr: false): window existe desde el primer render
  const [webgl] = useState(hasWebGL)
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const [status, setStatus] = useState<Status>(() => (webgl ? { kind: "loading" } : { kind: "no-webgl" }))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!webgl) return
    let alive = true
    loadCity()
      .then((model) => alive && setStatus({ kind: "ready", model }))
      .catch(() => alive && setStatus({ kind: "error" }))
    return () => {
      alive = false
    }
  }, [webgl, attempt])

  return (
    <div
      data-city3d
      data-status={status.kind}
      className="relative h-[calc(100dvh-4rem)] w-full overflow-hidden bg-[#1a2547] max-md:h-[calc(100dvh-7.5rem-env(safe-area-inset-bottom))]"
    >
      {status.kind === "ready" ? (
        <ExplorerProvider
          model={status.model}
          places={places}
          routes={routes}
          initialRouteId={initialRouteId}
          progress={progress}
          saveProgress={saveProgress}
          reducedMotion={reducedMotion}
        >
          <ExplorerLayout />
        </ExplorerProvider>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#2c3f7a_0%,#141d38_70%)] px-6 text-center text-white">
          <div className="w-full max-w-xs">
            <Crenellation className="mx-auto mb-5 w-40 bg-[#FFD9A8]" />
            {status.kind === "loading" && <p className="animate-pulse font-serif text-xl">{t("loading")}</p>}
            {status.kind === "error" && (
              <>
                <p className="font-serif text-xl">{t("error")}</p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus({ kind: "loading" })
                    setAttempt((a) => a + 1)
                  }}
                  className="mt-4 rounded-full bg-coral px-5 py-2 text-sm font-semibold"
                >
                  {t("retry")}
                </button>
              </>
            )}
            {status.kind === "no-webgl" && (
              <>
                <p className="font-serif text-xl">{t("noWebgl")}</p>
                <Link href="/map" className="mt-4 inline-block rounded-full bg-coral px-5 py-2 text-sm font-semibold">
                  {t("classic")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Si el contexto WebGL no vuelve en este tiempo, se monta un canvas nuevo. */
const REBUILD_AFTER_MS = 4000

function ExplorerLayout() {
  const t = useTranslations("city3d")
  const { state, dispatch, camera, model } = useExplorer()
  const [ready, setReady] = useState(false)
  const [lost, setLost] = useState(false)
  const [canvasKey, setCanvasKey] = useState(0)
  const rebuild = useRef<number | null>(null)

  const onContextLost = () => {
    setLost(true)
    if (rebuild.current) window.clearTimeout(rebuild.current)
    rebuild.current = window.setTimeout(() => {
      rebuild.current = null
      setCanvasKey((k) => k + 1)
      setLost(false)
    }, REBUILD_AFTER_MS)
  }
  const onContextRestored = () => {
    if (rebuild.current) window.clearTimeout(rebuild.current)
    rebuild.current = null
    setLost(false)
  }
  useEffect(() => () => void (rebuild.current && window.clearTimeout(rebuild.current)), [])

  const night = useMemo(() => {
    const s = sunPosition(cartagenaDateAt(state.minutes), model.origin.lat, model.origin.lng)
    return paletteFor(s.altitude).night
  }, [state.minutes, model.origin])

  // reloj en vivo: avanza con la hora real de Cartagena
  useEffect(() => {
    if (!state.live) return
    const id = window.setInterval(() => dispatch({ type: "live", minutes: cartagenaMinutes(new Date()) }), 30_000)
    return () => window.clearInterval(id)
  }, [state.live, dispatch])

  return (
    <div className="absolute inset-0" data-city3d-stage data-ready={ready ? "" : undefined} data-night={night >= 0.5 ? "" : undefined}>
      <div className={cn("absolute inset-0 transition-opacity duration-300", lost && "opacity-0")}>
        <CityCanvas
          key={canvasKey}
          onReady={() => setReady(true)}
          onContextLost={onContextLost}
          onContextRestored={onContextRestored}
        />
      </div>
      {/* póster mientras el navegador devuelve (o no) el contexto WebGL */}
      <div
        data-city3d-poster
        aria-hidden={!lost}
        className={cn(
          "absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#2c3f7a_0%,#141d38_70%)] px-6 text-center text-white transition-opacity duration-300",
          lost ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div>
          <Crenellation className="mx-auto mb-4 w-32 bg-[#FFD9A8]" />
          <p className="font-serif text-lg">{t("recovering")}</p>
        </div>
      </div>
      {!lost && <MapOverlay />}

      <ExplorerPanel />

      {/* controles de cámara */}
      <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-full border border-foreground/10 bg-background text-foreground shadow-md md:right-4 md:top-4">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "select", selection: null })
            camera.overview()
          }}
          className="grid h-10 w-10 place-items-center hover:bg-foreground/5"
          aria-label={t("overview")}
          title={t("overview")}
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => camera.flyTo(-350, 100, { distance: 900, polar: 0.2, azimuth: 0 })}
          className="grid h-10 w-10 place-items-center hover:bg-foreground/5"
          aria-label={t("north")}
          title={t("north")}
        >
          <Compass className="h-4 w-4" />
        </button>
        <Link
          href="/map"
          className="grid h-10 w-10 place-items-center hover:bg-foreground/5"
          aria-label={t("classic")}
          title={t("classic")}
        >
          <MapIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* escritorio: hora abajo y selección a la derecha */}
      <div className="absolute bottom-4 left-[392px] right-4 z-10 mx-auto hidden max-w-xl rounded-2xl bg-background/95 px-4 py-3 text-foreground shadow-xl md:block">
        <TimeDock />
      </div>
      {state.selection && <SelectionCard className="absolute right-16 top-4 z-10 hidden w-80 md:block" />}

      <p className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-background/85 px-2.5 py-1 text-[10px] text-foreground/70 md:left-auto md:right-4 md:top-auto md:bottom-1.5 md:text-[11px]">
        <span className="hidden md:inline">{t("hintMouse")} · </span>© OpenStreetMap contributors
      </p>
    </div>
  )
}
