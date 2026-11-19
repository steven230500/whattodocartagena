"use client"

import { createContext, useContext, useMemo, useReducer, useRef, type ReactNode } from "react"
import type { CameraControls } from "@react-three/drei"
import type { CityModel } from "../domain/city-model"
import type { ExplorerPlace, ExplorerRoute, PlaceKind } from "../domain/explorer"
import { createProjection, type Projection } from "../domain/projection"
import { StreetGraph, type PathResult } from "../domain/street-graph"
import { cartagenaMinutes } from "../domain/sun"
import { AnchorRegistry } from "./anchors"

export type Tab = "explore" | "routes" | "barrios"

export type Selection =
  | { type: "place"; id: string }
  | { type: "building"; id: number }
  | { type: "stop"; index: number }
  | null

export interface ExplorerState {
  tab: Tab
  minutes: number
  live: boolean
  kinds: PlaceKind[]
  barrio: number
  routeId: string | null
  touring: boolean
  stop: number
  selection: Selection
}

type Action =
  | { type: "tab"; tab: Tab }
  | { type: "time"; minutes: number }
  | { type: "live"; minutes: number }
  | { type: "toggleKind"; kind: PlaceKind }
  | { type: "barrio"; index: number }
  | { type: "route"; id: string | null }
  | { type: "tour"; playing: boolean }
  | { type: "stop"; index: number }
  | { type: "select"; selection: Selection }

const ALL_KINDS: PlaceKind[] = ["heritage", "food", "culture", "shop", "nature"]

function reducer(s: ExplorerState, a: Action): ExplorerState {
  switch (a.type) {
    case "tab":
      return { ...s, tab: a.tab }
    case "time":
      return { ...s, minutes: a.minutes, live: false }
    case "live":
      return { ...s, minutes: a.minutes, live: true }
    case "toggleKind":
      return { ...s, kinds: s.kinds.includes(a.kind) ? s.kinds.filter((k) => k !== a.kind) : [...s.kinds, a.kind] }
    case "barrio":
      return { ...s, barrio: s.barrio === a.index ? -1 : a.index, selection: null }
    case "route":
      // al elegir ruta se encuadra completa; la parada se elige después (o con el recorrido)
      return { ...s, routeId: a.id, touring: false, stop: 0, barrio: -1, selection: null }
    case "tour":
      return { ...s, touring: a.playing }
    case "stop":
      return { ...s, stop: a.index, selection: { type: "stop", index: a.index } }
    case "select":
      return { ...s, selection: a.selection, touring: a.selection?.type === "stop" ? s.touring : false }
  }
}

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
  reducedMotion,
  children,
}: {
  model: CityModel
  places: ExplorerPlace[]
  routes: ExplorerRoute[]
  initialRouteId?: string
  reducedMotion: boolean
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    tab: initialRouteId ? "routes" : "explore",
    minutes: cartagenaMinutes(new Date()),
    live: true,
    kinds: ALL_KINDS,
    barrio: -1,
    routeId: initialRouteId ?? null,
    touring: false,
    stop: 0,
    selection: null,
  }) as ExplorerState)
  const controls = useRef<CameraControls | null>(null)
  const anchors = useRef<AnchorRegistry>(null as unknown as AnchorRegistry)
  if (!anchors.current) anchors.current = new AnchorRegistry()

  const projection = useMemo(() => createProjection(model.origin), [model.origin])
  const graph = useMemo(() => new StreetGraph(model.graph.nodes, model.graph.edges), [model])
  const routePath = useMemo(() => {
    const route = routes.find((r) => r.id === state.routeId)
    if (!route || route.stops.length === 0) return null
    return graph.routeThrough(route.stops.map((s) => projection.toLocal(s.position)))
  }, [routes, state.routeId, graph, projection])

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
      anchors: anchors.current,
      state,
      dispatch,
      controls,
      camera,
      reducedMotion,
    }),
    [model, places, routes, projection, routePath, state, camera, reducedMotion],
  )
  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>
}

export function useExplorer() {
  const ctx = useContext(ExplorerContext)
  if (!ctx) throw new Error("useExplorer fuera de ExplorerProvider")
  return ctx
}
