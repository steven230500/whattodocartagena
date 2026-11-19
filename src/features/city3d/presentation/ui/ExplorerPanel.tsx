"use client"

import { useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Footprints, Pause, Play } from "lucide-react"
import { useTranslations } from "next-intl"
import { useExplorer, type Tab } from "../state"
import type { PlaceKind } from "../../domain/explorer"
import { createProjection } from "../../domain/projection"
import { focusDistance } from "../../domain/city-queries"
import { PLACE_COLORS, SURFACES } from "../palette"
import { TimeDock } from "./TimeDock"
import { SelectionCard } from "./SelectionCard"
import { cn } from "@/lib/utils"
import { stopStatus } from "../../application/explorer-state"

const KINDS: PlaceKind[] = ["heritage", "food", "culture", "shop", "nature"]
const HISTORIC = new Set(["Centro", "San Diego", "Getsemaní", "La Matuna"])

/** Borde de almenas: la firma visual de DESIGN.md. */
export function Crenellation({ className, tooth = 12, gap = 7 }: { className?: string; tooth?: number; gap?: number }) {
  const mask = `repeating-linear-gradient(90deg,#000 0 ${tooth}px,transparent ${tooth}px ${tooth + gap}px)`
  return <div aria-hidden className={cn("h-2 w-full bg-foreground", className)} style={{ WebkitMaskImage: mask, maskImage: mask }} />
}

/** En celular, tras elegir algo en la lista, bajar la hoja para que se vea el mapa. */
const isMobile = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches

/**
 * Panel lateral en escritorio; hoja inferior arrastrable en celular.
 */
export function ExplorerPanel() {
  const t = useTranslations("city3d")
  const { state, dispatch } = useExplorer()
  const [expanded, setExpanded] = useState(false)
  const drag = useRef<number | null>(null)

  const onHandleDown = (e: React.PointerEvent) => {
    drag.current = e.clientY
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onHandleUp = (e: React.PointerEvent) => {
    const start = drag.current
    drag.current = null
    if (start === null) return
    const dy = e.clientY - start
    if (Math.abs(dy) < 8) setExpanded((v) => !v)
    else setExpanded(dy < 0)
  }

  const tabs: Tab[] = ["explore", "routes", "barrios"]
  const onPick = () => isMobile() && setExpanded(false)

  return (
    <section
      aria-label={t("title")}
      className={cn(
        "absolute z-20 flex flex-col overflow-hidden bg-background text-foreground shadow-[0_-8px_30px_rgba(0,0,0,.18)]",
        // celular: hoja inferior
        "inset-x-0 bottom-0 rounded-t-2xl transition-[height] duration-300 ease-out",
        expanded ? "h-[68%]" : "h-auto max-h-[60%]",
        "md:max-h-none",
        // escritorio: panel lateral
        "md:inset-x-auto md:bottom-4 md:left-4 md:top-4 md:h-auto md:w-[360px] md:rounded-2xl md:shadow-xl",
      )}
    >
      {/* asa (solo celular) */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={expanded ? t("collapse") : t("expand")}
        onPointerDown={onHandleDown}
        onPointerUp={onHandleUp}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded((v) => !v)}
        className="flex shrink-0 cursor-grab touch-none justify-center pb-2 pt-2.5 md:hidden"
      >
        <Crenellation className="h-1.5 w-[62px] bg-foreground/30" tooth={8} gap={5} />
      </div>

      <header className="hidden shrink-0 md:block">
        <Crenellation />
        <div className="px-5 pb-3 pt-4">
          <h1 className="font-serif text-2xl font-bold leading-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-foreground/65">{t("subtitle")}</p>
        </div>
      </header>

      {/* celular plegado con algo seleccionado: solo la tarjeta */}
      {!expanded && state.selection && (
        <div className="shrink-0 px-4 pb-4 md:hidden">
          <SelectionCard className="shadow-none ring-1 ring-foreground/10" />
        </div>
      )}

      <div className={cn("shrink-0 px-4 md:hidden", !expanded && state.selection && "hidden")}>
        <TimeDock compact={!expanded} />
      </div>

      <nav
        className={cn("mt-2 flex shrink-0 gap-1 px-4 md:mt-0", !expanded && "max-md:pb-3", !expanded && state.selection && "max-md:hidden")}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={state.tab === tab}
            onClick={() => {
              dispatch({ type: "tab", tab })
              setExpanded(true)
            }}
            className={cn(
              "flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              state.tab === tab ? "bg-foreground text-background" : "text-foreground/70 hover:bg-foreground/5",
            )}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </nav>

      <div className={cn("mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6", !expanded && "max-md:hidden")}>
        {state.selection && <SelectionCard className="mb-4 md:hidden" />}
        {state.tab === "explore" && <ExploreTab onPick={onPick} />}
        {state.tab === "routes" && <RoutesTab onPick={onPick} />}
        {state.tab === "barrios" && <BarriosTab onPick={onPick} />}
      </div>
    </section>
  )
}

function ExploreTab({ onPick }: { onPick: () => void }) {
  const t = useTranslations("city3d")
  const { places, state, dispatch, camera, model, placeBuilding } = useExplorer()
  const visible = places.filter((p) => state.kinds.includes(p.kind))
  const counts = Object.fromEntries(KINDS.map((k) => [k, places.filter((p) => p.kind === k).length]))
  const proj = useMemo(() => createProjection(model.origin), [model.origin])

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {KINDS.filter((k) => counts[k] > 0).map((k) => {
          const on = state.kinds.includes(k)
          return (
            <button
              key={k}
              type="button"
              aria-pressed={on}
              onClick={() => dispatch({ type: "toggleKind", kind: k })}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                on ? "border-foreground/20 bg-card" : "border-transparent bg-foreground/5 text-foreground/45",
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: on ? PLACE_COLORS[k] : "currentColor" }} />
              {t(`kinds.${k}`)}
              <span className="tabular-nums text-foreground/45">{counts[k]}</span>
            </button>
          )
        })}
      </div>
      <ul className="mt-3 divide-y divide-foreground/10">
        {visible.map((p) => {
          const selected = state.selection?.type === "place" && state.selection.id === p.id
          return (
            <li key={p.id}>
              <button
                type="button"
                data-place={p.id}
                onMouseEnter={() => dispatch({ type: "hover", id: placeBuilding[p.id] ?? -1 })}
                onMouseLeave={() => dispatch({ type: "hover", id: -1 })}
                onClick={() => {
                  dispatch({ type: "select", selection: { type: "place", id: p.id } })
                  const [x, y] = proj.toLocal(p.position)
                  camera.flyTo(x, y, { distance: focusDistance(model.buildings, placeBuilding[p.id] ?? -1), polar: 0.9 })
                  onPick()
                }}
                className={cn(
                  "flex w-full items-center gap-3 py-2.5 text-left transition-colors",
                  selected ? "text-coral" : "hover:text-coral",
                )}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PLACE_COLORS[p.kind] }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  {p.subtitle && <span className="line-clamp-2 text-xs text-foreground/55">{p.subtitle}</span>}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-foreground/30" aria-hidden />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function RoutesTab({ onPick }: { onPick: () => void }) {
  const t = useTranslations("city3d.routes")
  const { routes, state, dispatch, camera } = useExplorer()
  const active = routes.find((r) => r.id === state.routeId)

  if (!routes.length) return <p className="text-sm text-foreground/60">{t("empty")}</p>

  if (active) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "route", id: null })
            camera.overview()
          }}
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-foreground/60 hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> {t("back")}
        </button>
        <h2 className="font-serif text-xl font-bold leading-tight">{active.title}</h2>
        <p className="mt-1 text-xs text-foreground/60">
          {[active.duration, active.distance, t("stops", { count: active.stops.length })].filter(Boolean).join(" · ")}
        </p>
        <button
          type="button"
          data-tour={state.touring ? "playing" : "paused"}
          onClick={() => {
            dispatch({ type: "tour", playing: !state.touring })
            onPick()
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-coral px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
        >
          {state.touring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {state.touring ? t("pause") : t("play")}
        </button>
        <ol className="relative mt-4 space-y-1 border-l-2 border-dashed border-foreground/15 pl-4">
          {active.stops.map((s, i) => {
            const status = stopStatus(state, i)
            const current = status === "current"
            const done = status === "done"
            return (
              <li key={s.id} className="relative">
                <span
                  className="absolute -left-[1.4rem] top-2.5 grid h-4 w-4 place-items-center rounded-full border-2 border-background"
                  style={{ background: current ? SURFACES.route : done ? SURFACES.routeDone : "#2A1F1A" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "stop", index: i })
                    onPick()
                  }}
                  className={cn(
                    "w-full rounded-lg px-2 py-2 text-left text-sm transition-colors",
                    current ? "bg-coral/10 font-semibold text-coral" : "hover:bg-foreground/5",
                  )}
                >
                  <span className="mr-1.5 tabular-nums text-foreground/45">{i + 1}.</span>
                  {s.title}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {routes.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            data-route={r.slug}
            onClick={() => {
              dispatch({ type: "route", id: r.id })
              onPick()
            }}
            className="group flex w-full items-start gap-3 rounded-xl border border-foreground/10 bg-card p-3 text-left transition-colors hover:border-coral/50"
          >
            <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden />
            <span className="min-w-0">
              <span className="block font-medium leading-snug group-hover:text-coral">{r.title}</span>
              <span className="mt-0.5 block text-xs text-foreground/55">
                {[r.duration, r.distance, t("stops", { count: r.stops.length })].filter(Boolean).join(" · ")}
              </span>
              {state.visited[r.id] != null && (
                <span data-progress={r.slug} className="mt-1.5 flex items-center gap-2 text-[11px] font-medium text-colonial-gold">
                  <span className="h-1 w-16 overflow-hidden rounded-full bg-foreground/10">
                    <span
                      className="block h-full rounded-full bg-colonial-gold"
                      style={{ width: `${((state.visited[r.id] + 1) / r.stops.length) * 100}%` }}
                    />
                  </span>
                  {t("progress", { done: Math.min(state.visited[r.id] + 1, r.stops.length), total: r.stops.length })}
                </span>
              )}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function BarriosTab({ onPick }: { onPick: () => void }) {
  const t = useTranslations("city3d.barrios")
  const { model, state, dispatch, camera } = useExplorer()
  const items = model.barrios.map((b, i) => ({ ...b, i }))
  const groups = [
    { title: t("historic"), list: items.filter((b) => HISTORIC.has(b.name)) },
    { title: t("others"), list: items.filter((b) => !HISTORIC.has(b.name)) },
  ]
  const counts = new Map<number, number>()
  for (const b of model.buildings) counts.set(b.barrio, (counts.get(b.barrio) ?? 0) + 1)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-foreground/60">{t("hint")}</p>
        {state.barrio >= 0 && (
          <button
            type="button"
            data-barrio-clear
            onClick={() => {
              dispatch({ type: "barrio", index: state.barrio })
              camera.overview()
            }}
            className="shrink-0 rounded-full border border-coral px-3 py-1 text-xs font-semibold text-coral hover:bg-coral/10"
          >
            {t("clear")}
          </button>
        )}
      </div>
      {groups.map((g) => (
        <div key={g.title}>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/45">{g.title}</h3>
          <ul className="divide-y divide-foreground/10">
            {g.list.map((b) => {
              const on = state.barrio === b.i
              return (
                <li key={b.name}>
                  <button
                    type="button"
                    aria-pressed={on}
                    data-barrio-item={b.name}
                    onClick={() => {
                      dispatch({ type: "barrio", index: b.i })
                      if (!on) {
                        camera.flyTo(b.center[0], b.center[1], { distance: 650, polar: 0.8 })
                        onPick()
                      }
                    }}
                    className={cn(
                      "flex w-full items-center justify-between py-2.5 text-left text-sm transition-colors",
                      on ? "font-semibold text-coral" : "hover:text-coral",
                    )}
                  >
                    <span className="font-serif text-base">{b.name}</span>
                    <span className="flex items-center gap-1 text-xs tabular-nums text-foreground/45">
                      {t("buildings", { count: counts.get(b.i) ?? 0 })}
                      <ChevronRight className="h-4 w-4 text-foreground/30" aria-hidden />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
