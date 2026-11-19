"use client"

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react"
import type { CameraControls } from "@react-three/drei"
import type { CityModel } from "../domain/city-model"
import type { ExplorerPlace, ExplorerRoute } from "../domain/explorer"
import { createProjection, type Projection } from "../domain/projection"
import { StreetGraph, type PathResult } from "../domain/street-graph"
import { findBuildingAt } from "../domain/city-queries"
import { cartagenaMinutes } from "../domain/sun"
import { initialState, reducer, type Action, type ExplorerState } from "../application/explorer-state"
import { AnchorRegistry } from "./anchors"

export type { Tab, Selection, ExplorerState } from "../application/explorer-state"

/** Guarda el avance en una ruta (server action; sin sesión no hace nada). */
export type SaveProgress = (routeId: string, step: number) => Promise<void>

export interface CameraApi {
  /** vuela a un punto local (x este, y norte) */
  flyTo(x: number, y: number, opts?: { distance?: number; polar?: number; azimuth?: number; height?: number }): void
  overview(): void
}

interface Ctx {
  model: CityModel
  places: ExplorerPlace[]
  routes: ExplorerRoute[]
  projection: Projection
  /** ruta activa trazada por calles (null si no hay ruta elegida) */
  routePath: PathResult | null
  /** edificio bajo cada lugar (id de lugar → índice de edificio, o -1) */
  placeBuilding: Record<string, number>
  /** edificio a resaltar como seleccionado (directo o vía lugar) */
  selectedBuilding: number
  anchors: AnchorRegistry
  state: ExplorerState
  dispatch: (a: Action) => void
  controls: React.RefObject<CameraControls | null>
  camera: CameraApi
  reducedMotion: boolean
}

const ExplorerContext = createContext<Ctx | null>(null)

export function ExplorerProvider({
  model,
  places,
  routes,
  initialRouteId,
  initialPlaceId,
  progress,
  saveProgress,
  reducedMotion,
  children,
}: {
  model: CityModel
  places: ExplorerPlace[]
  routes: ExplorerRoute[]
  initialRouteId?: string
  initialPlaceId?: string
  progress?: Record<string, number>
  saveProgress?: SaveProgress
  reducedMotion: boolean
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState({ minutes: cartagenaMinutes(new Date()), routeId: initialRouteId, placeId: initialPlaceId, progress }),
  )
  const controls = useRef<CameraControls | null>(null)
  const [anchors] = useState(() => new AnchorRegistry())

  const projection = useMemo(() => createProjection(model.origin), [model.origin])
  const graph = useMemo(() => new StreetGraph(model.graph.nodes, model.graph.edges), [model])
  const routePath = useMemo(() => {
    const route = routes.find((r) => r.id === state.routeId)
    if (!route || route.stops.length === 0) return null
    return graph.routeThrough(route.stops.map((s) => projection.toLocal(s.position)))
  }, [routes, state.routeId, graph, projection])

  const placeBuilding = useMemo(() => {
    const out: Record<string, number> = {}
    for (const p of places) {
      const [x, y] = projection.toLocal(p.position)
      out[p.id] = findBuildingAt(model.buildings, x, y)
    }
    return out
  }, [places, projection, model.buildings])

  const sel = state.selection
  const selectedBuilding =
    sel?.type === "building" ? sel.id : sel?.type === "place" ? (placeBuilding[sel.id] ?? -1) : -1

  // progreso: guardar la parada alcanzada (pasivo, como el reproductor de rutas)
  const lastSaved = useRef<string>("")
  useEffect(() => {
    if (!saveProgress || !state.routeId || state.selection?.type !== "stop") return
    const key = `${state.routeId}:${state.stop}`
    if (lastSaved.current === key) return
    lastSaved.current = key
    saveProgress(state.routeId, state.stop).catch(() => {})
  }, [saveProgress, state.routeId, state.stop, state.selection])

  const camera = useMemo<CameraApi>(
    () => ({
      flyTo(x, y, opts = {}) {
        const c = controls.current
        if (!c) return
        const distance = opts.distance ?? 260
        const polar = opts.polar ?? 0.95
        const azimuth = opts.azimuth ?? c.azimuthAngle
        const h = opts.height ?? 0
        const ex = x + distance * Math.sin(polar) * Math.sin(azimuth)
        const ey = h + distance * Math.cos(polar)
        const ez = -y + distance * Math.sin(polar) * Math.cos(azimuth)
        void c.setLookAt(ex, ey, ez, x, h, -y, !reducedMotion)
      },
      overview() {
        const c = controls.current
        if (!c) return
        // ciudad amurallada + Getsemaní, vista desde el sur-sureste
        const [tx, ty] = [-380, 150]
        // en vertical (celular) el campo horizontal es angosto: alejar
        const narrow = typeof window !== "undefined" && window.innerWidth < 768
        const distance = narrow ? 2500 : 1700
        const polar = 0.85
        const azimuth = 0.3
        void c.setLookAt(
          tx + distance * Math.sin(polar) * Math.sin(azimuth),
          distance * Math.cos(polar),
          -ty + distance * Math.sin(polar) * Math.cos(azimuth),
          tx,
          0,
          -ty,
          !reducedMotion,
        )
      },
    }),
    [reducedMotion],
  )

  const value = useMemo(
    () => ({
      model,
      places,
      routes,
      projection,
      routePath,
      placeBuilding,
      selectedBuilding,
      anchors,
      state,
      dispatch,
      controls,
      camera,
      reducedMotion,
    }),
    [model, places, routes, projection, routePath, placeBuilding, selectedBuilding, anchors, state, camera, reducedMotion],
  )
  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>
}

export function useExplorer() {
  const ctx = useContext(ExplorerContext)
  if (!ctx) throw new Error("useExplorer fuera de ExplorerProvider")
  return ctx
}
