"use client"

import { useCallback } from "react"
import { useExplorer } from "../state"
import { PLACE_COLORS, SURFACES } from "../palette"
import { ROUTE_Y } from "../scene/RouteLayer"
import { cn } from "@/lib/utils"
import { stopStatus } from "../../application/explorer-state"
import { focusDistance } from "../../domain/city-queries"

/** Barrios con etiqueta siempre visible (el resto aparece al elegirlo en la pestaña Barrios). */
const LABELED_BARRIOS = new Set(["Centro", "San Diego", "Getsemaní", "La Matuna", "Manga", "El Espinal"])

/** Registra un elemento DOM en un punto 3D; el Canvas lo reubica en cada cuadro. */
function useAnchor(id: string, pos: [number, number, number]) {
  const { anchors } = useExplorer()
  const [x, y, z] = pos
  return useCallback((el: HTMLElement | null) => anchors.register(id, el, [x, y, z]), [anchors, id, x, y, z])
}

/**
 * Pines, etiquetas de barrio y paradas de la ruta como DOM sobre el Canvas.
 * Queda por debajo de los paneles (z-index) y es navegable con teclado.
 */
export function MapOverlay() {
  const { state, places, model, routes, routePath } = useExplorer()
  const route = routes.find((r) => r.id === state.routeId)

  return (
    <div data-city3d-pins className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-label="Marcadores">
      {!route &&
        model.barrios.map((b, i) =>
          LABELED_BARRIOS.has(b.name) || state.barrio === i ? <BarrioLabel key={b.name} index={i} /> : null,
        )}
      {!route && places.filter((p) => state.kinds.includes(p.kind)).map((p) => <PlacePin key={p.id} id={p.id} />)}
      {route && routePath && route.stops.map((s, i) => <StopPin key={s.id} index={i} />)}
    </div>
  )
}

function PlacePin({ id }: { id: string }) {
  const { places, projection, state, dispatch, camera, placeBuilding, model } = useExplorer()
  const p = places.find((x) => x.id === id)!
  const [x, y] = projection.toLocal(p.position)
  const ref = useAnchor(`place:${id}`, [x, 14, -y])
  const selected = state.selection?.type === "place" && state.selection.id === id

  return (
    <div ref={ref} className={cn("absolute left-0 top-0 will-change-transform", selected ? "z-20" : "z-10")}>
      <button
        type="button"
        aria-label={p.name}
        aria-pressed={selected}
        data-pin={id}
        data-state={selected ? "selected" : "idle"}
        onMouseEnter={() => dispatch({ type: "hover", id: placeBuilding[id] ?? -1 })}
        onMouseLeave={() => dispatch({ type: "hover", id: -1 })}
        onClick={() => {
          dispatch({ type: "select", selection: selected ? null : { type: "place", id } })
          if (!selected) camera.flyTo(x, y, { distance: focusDistance(model.buildings, placeBuilding[id] ?? -1), polar: 0.9 })
        }}
        className="group pointer-events-auto absolute bottom-0 left-0 flex -translate-x-1/2 flex-col items-center"
      >
        {selected && (
          <span className="mb-1 whitespace-nowrap rounded-md bg-[#2A1F1A] px-2 py-1 text-xs font-medium text-white shadow-lg">
            {p.name}
          </span>
        )}
        <span
          className={cn(
            "block rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,.35)] transition-transform group-hover:scale-125 group-focus-visible:scale-125",
            selected ? "h-5 w-5" : "h-3.5 w-3.5",
          )}
          style={{ background: PLACE_COLORS[p.kind] }}
        />
        <span className="h-3 w-px bg-white/90" />
      </button>
    </div>
  )
}

function BarrioLabel({ index }: { index: number }) {
  const { model, state, dispatch, camera } = useExplorer()
  const b = model.barrios[index]
  const ref = useAnchor(`barrio:${b.name}`, [b.center[0], 30, -b.center[1]])
  const active = state.barrio === index
  return (
    <div ref={ref} className="absolute left-0 top-0 z-[15] will-change-transform">
      <button
        type="button"
        aria-pressed={active}
        data-barrio={b.name}
        onClick={() => {
          dispatch({ type: "barrio", index })
          if (!active) camera.flyTo(b.center[0], b.center[1], { distance: 650, polar: 0.8 })
        }}
        className={cn(
          "pointer-events-auto absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-sm tracking-wide transition-colors [text-shadow:0_1px_3px_rgba(0,0,0,.6)] md:text-base",
          active ? "text-[#FFD9A8]" : "text-white/95 hover:text-[#FFD9A8]",
        )}
      >
        {b.name}
      </button>
    </div>
  )
}

function StopPin({ index }: { index: number }) {
  const { routes, routePath, state, dispatch } = useExplorer()
  const route = routes.find((r) => r.id === state.routeId)!
  const s = route.stops[index]
  const k = routePath!.stopIndex[index]
  const ref = useAnchor(`stop:${route.id}:${s.id}`, [routePath!.points[k * 2], ROUTE_Y + 6, -routePath!.points[k * 2 + 1]])
  const status = stopStatus(state, index)
  const active = status === "current"
  const done = status === "done"
  return (
    <div ref={ref} className={cn("absolute left-0 top-0 will-change-transform", active ? "z-20" : "z-10")}>
      <button
        type="button"
        onClick={() => dispatch({ type: "stop", index })}
        aria-label={`${index + 1}. ${s.title}`}
        aria-current={active ? "step" : undefined}
        data-stop={index}
        data-state={status}
        className={cn(
          "pointer-events-auto absolute left-0 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 font-semibold shadow-[0_2px_10px_rgba(0,0,0,.45)] transition-all",
          active ? "h-9 w-9 border-white text-sm text-white" : "h-7 w-7 text-xs",
          !active && (done ? "border-white text-white" : "border-[#2A1F1A] text-[#2A1F1A]"),
        )}
        style={{ background: active ? SURFACES.route : done ? SURFACES.routeDone : "#FEF7ED" }}
      >
        {index + 1}
      </button>
    </div>
  )
}
