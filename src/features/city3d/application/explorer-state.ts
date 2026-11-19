/**
 * Estado del explorador 3D y sus transiciones. Puro (sin React ni three.js):
 * lo usa presentation/state.tsx con useReducer y se prueba con vitest.
 */
import type { PlaceKind } from "../domain/explorer"

export type Tab = "explore" | "routes" | "barrios"

export type Selection =
  | { type: "place"; id: string }
  | { type: "building"; id: number }
  | { type: "stop"; index: number }
  | null

export interface ExplorerState {
  tab: Tab
  /** minutos del día, hora de Cartagena */
  minutes: number
  /** la hora sigue al reloj real */
  live: boolean
  kinds: PlaceKind[]
  /** barrio en foco (-1 = ninguno) */
  barrio: number
  routeId: string | null
  touring: boolean
  /** parada actual de la ruta activa */
  stop: number
  /** parada más lejana alcanzada por ruta (progreso) */
  visited: Record<string, number>
  selection: Selection
  /** edificio resaltado al pasar el cursor (-1 = ninguno) */
  hover: number
}

export type Action =
  | { type: "tab"; tab: Tab }
  | { type: "time"; minutes: number }
  | { type: "live"; minutes: number }
  | { type: "toggleKind"; kind: PlaceKind }
  | { type: "barrio"; index: number }
  | { type: "route"; id: string | null }
  | { type: "tour"; playing: boolean }
  | { type: "stop"; index: number }
  | { type: "select"; selection: Selection }
  | { type: "hover"; id: number }

export const ALL_KINDS: PlaceKind[] = ["heritage", "food", "culture", "shop", "nature"]

export function initialState(opts: {
  minutes: number
  routeId?: string
  placeId?: string
  progress?: Record<string, number>
}): ExplorerState {
  const visited = { ...(opts.progress ?? {}) }
  return {
    tab: opts.routeId ? "routes" : "explore",
    minutes: opts.minutes,
    live: true,
    kinds: ALL_KINDS,
    barrio: -1,
    routeId: opts.routeId ?? null,
    touring: false,
    stop: opts.routeId ? (visited[opts.routeId] ?? 0) : 0,
    visited,
    selection: !opts.routeId && opts.placeId ? { type: "place", id: opts.placeId } : null,
    hover: -1,
  }
}

export function reducer(s: ExplorerState, a: Action): ExplorerState {
  switch (a.type) {
    case "tab":
      return { ...s, tab: a.tab }
    case "time":
      return { ...s, minutes: ((a.minutes % 1440) + 1440) % 1440, live: false }
    case "live":
      return { ...s, minutes: a.minutes, live: true }
    case "toggleKind":
      return { ...s, kinds: s.kinds.includes(a.kind) ? s.kinds.filter((k) => k !== a.kind) : [...s.kinds, a.kind] }
    case "barrio":
      return { ...s, barrio: s.barrio === a.index ? -1 : a.index, selection: null }
    case "route":
      // se encuadra la ruta completa y se retoma donde el usuario la dejó
      return {
        ...s,
        routeId: a.id,
        touring: false,
        stop: a.id ? (s.visited[a.id] ?? 0) : 0,
        barrio: -1,
        selection: null,
      }
    case "tour":
      return { ...s, touring: s.routeId ? a.playing : false }
    case "stop": {
      if (!s.routeId) return s
      const visited = { ...s.visited, [s.routeId]: Math.max(s.visited[s.routeId] ?? 0, a.index) }
      return { ...s, stop: a.index, visited, selection: { type: "stop", index: a.index } }
    }
    case "select":
      return { ...s, selection: a.selection, touring: a.selection?.type === "stop" ? s.touring : false }
    case "hover":
      return s.hover === a.id ? s : { ...s, hover: a.id }
  }
}

/** Estado de cada parada para pintarla: actual, ya recorrida o pendiente. */
export function stopStatus(s: ExplorerState, index: number): "current" | "done" | "pending" {
  if (index === s.stop) return "current"
  const reached = s.routeId ? (s.visited[s.routeId] ?? -1) : -1
  return index <= reached || index < s.stop ? "done" : "pending"
}
