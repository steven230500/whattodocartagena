"use client"

import { useMemo, useRef, useState, useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import { useLocale, useTranslations } from "next-intl"
import { ArrowRight, Box, ChevronRight, Footprints, LocateFixed, Navigation, Search, X } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { PLACE_KINDS, type LatLng, type Place, type PlaceKind } from "../domain/place"
import { formatClock, type OpenStatus } from "../domain/opening-hours"
import { formatDistance } from "../domain/distance"
import { barriosOf, placeRows, type PlaceFilters, type PlaceRow } from "../application/place-list"
import { PLACE_COLORS } from "./palette"

const LeafletPlaces = dynamic(() => import("./LeafletPlaces"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#e9dfcf]" />,
})

const EMPTY_FILTERS: PlaceFilters = { query: "", kinds: PLACE_KINDS, barrio: "", openNow: false }

/**
 * Minuto actual del visitante. En el servidor es null: así "abierto / cerrado"
 * no se pinta con la hora del servidor (evita desajustes de hidratación) y se
 * recalcula cada minuto en el navegador.
 */
const subscribeMinute = (cb: () => void) => {
  const id = window.setInterval(cb, 15_000)
  return () => window.clearInterval(id)
}
const currentMinute = () => Math.floor(Date.now() / 60_000)
const serverMinute = () => null

type Geo = { state: "idle" } | { state: "locating" } | { state: "ok"; position: LatLng } | { state: "error" }

export interface PlacesMapProps {
  places: Place[]
  routeCount: number
}

/** Mapa clásico (2D): lista filtrable de lugares junto al mapa, con los mismos lugares y colores que el 3D. */
export default function PlacesMap({ places, routeCount }: PlacesMapProps) {
  const t = useTranslations("map")
  const [filters, setFilters] = useState<PlaceFilters>(EMPTY_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [geo, setGeo] = useState<Geo>({ state: "idle" })
  const minute = useSyncExternalStore(subscribeMinute, currentMinute, serverMinute)
  const now = useMemo(() => (minute == null ? null : new Date(minute * 60_000)), [minute])
  const mapRef = useRef<HTMLDivElement>(null)

  const user = geo.state === "ok" ? geo.position : null
  const rows = useMemo(() => placeRows(places, filters, now, user), [places, filters, now, user])
  const barrios = useMemo(() => barriosOf(places), [places])
  const counts = useMemo(
    () => Object.fromEntries(PLACE_KINDS.map((k) => [k, places.filter((p) => p.kind === k).length])) as Record<PlaceKind, number>,
    [places],
  )
  const selected = rows.find((r) => r.place.id === selectedId) ?? null
  const filtered =
    filters.query !== "" || filters.barrio !== "" || filters.openNow || filters.kinds.length !== PLACE_KINDS.length

  const update = (patch: Partial<PlaceFilters>) => setFilters((f) => ({ ...f, ...patch }))
  const toggleKind = (k: PlaceKind) =>
    update({ kinds: filters.kinds.includes(k) ? filters.kinds.filter((x) => x !== k) : [...filters.kinds, k] })

  const select = (id: string | null, fromList = false) => {
    setSelectedId(id)
    // en celular el mapa queda arriba de la lista: llevar la vista hasta él
    if (fromList && id && window.matchMedia("(max-width: 767px)").matches) {
      mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const locate = () => {
    if (!navigator.geolocation) return setGeo({ state: "error" })
    setGeo({ state: "locating" })
    navigator.geolocation.getCurrentPosition(
      (p) => setGeo({ state: "ok", position: { lat: p.coords.latitude, lng: p.coords.longitude } }),
      () => setGeo({ state: "error" }),
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }

  return (
    <section id="mapa" aria-label={t("section")} className="scroll-mt-16 bg-background md:grid md:h-[calc(100dvh-4rem)] md:grid-cols-[380px_1fr]">
      {/* mapa: arriba en celular, a la derecha en escritorio */}
      <div ref={mapRef} className="relative h-[58dvh] scroll-mt-14 md:order-2 md:h-full">
        <LeafletPlaces places={rows.map((r) => r.place)} selectedId={selectedId} user={user} onSelect={(id) => select(id)} />
        <Link
          href="/map/3d"
          className="absolute right-3 top-3 z-[1000] inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 text-sm font-semibold text-background shadow-lg hover:bg-foreground/90"
        >
          <Box className="h-4 w-4" aria-hidden />
          {t("view3d")}
        </Link>
        {selected && <PlaceCard row={selected} onClose={() => setSelectedId(null)} />}
      </div>

      {/* panel: filtros y lista */}
      <div role="region" aria-label={t("panelTitle")} className="flex flex-col border-border md:order-1 md:min-h-0 md:border-r">
        <div className="shrink-0 border-b border-border px-4 pb-4 pt-5 md:px-5">
          <h2 className="font-serif text-2xl font-bold leading-tight">{t("panelTitle")}</h2>

          <label className="relative mt-3 block">
            <span className="sr-only">{t("search")}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" aria-hidden />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
              placeholder={t("search")}
              data-place-search
              className="w-full rounded-full border border-foreground/15 bg-card py-2 pl-9 pr-3 text-sm outline-none placeholder:text-foreground/40 focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/30"
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {PLACE_KINDS.filter((k) => counts[k] > 0).map((k) => {
              const on = filters.kinds.includes(k)
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  data-filter-kind={k}
                  onClick={() => toggleKind(k)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    on ? "border-foreground/20 bg-card" : "border-transparent bg-foreground/5 text-foreground/45 line-through",
                  )}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: on ? PLACE_COLORS[k] : "currentColor" }} />
                  {t(`kinds.${k}`)}
                  <span className="tabular-nums text-foreground/45">{counts[k]}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="map-barrio">
              {t("barrio")}
            </label>
            <select
              id="map-barrio"
              data-barrio-select
              value={filters.barrio}
              onChange={(e) => update({ barrio: e.target.value })}
              className="h-8 rounded-full border border-foreground/15 bg-card px-3 text-xs font-medium outline-none focus-visible:border-coral"
            >
              <option value="">{t("allBarrios")}</option>
              {barrios.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-pressed={filters.openNow}
              data-open-now
              onClick={() => update({ openNow: !filters.openNow })}
              className={cn(
                "h-8 rounded-full border px-3 text-xs font-medium transition-colors",
                filters.openNow ? "border-forest bg-forest text-white" : "border-foreground/15 bg-card hover:border-foreground/30",
              )}
            >
              {t("openNow")}
            </button>
            <button
              type="button"
              data-near-me
              onClick={locate}
              disabled={geo.state === "locating"}
              aria-pressed={geo.state === "ok"}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
                geo.state === "ok" ? "border-caribbean-blue text-caribbean-blue" : "border-foreground/15 bg-card hover:border-foreground/30",
              )}
            >
              <LocateFixed className="h-3.5 w-3.5" aria-hidden />
              {geo.state === "locating" ? t("locating") : t("nearMe")}
            </button>
          </div>
          {geo.state === "error" && <p className="mt-2 text-xs text-destructive">{t("locationError")}</p>}

          <p className="mt-3 flex items-center justify-between text-xs text-foreground/55" aria-live="polite">
            <span data-result-count={rows.length}>{t("results", { count: rows.length })}</span>
            {filtered && (
              <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="font-semibold text-coral hover:underline">
                {t("clear")}
              </button>
            )}
          </p>
        </div>

        <ul className="divide-y divide-foreground/10 px-4 md:min-h-0 md:flex-1 md:overflow-y-auto md:px-5">
          {rows.map((r) => (
            <li key={r.place.id}>
              <button
                type="button"
                data-place-item={r.place.id}
                aria-pressed={selectedId === r.place.id}
                onClick={() => select(selectedId === r.place.id ? null : r.place.id, true)}
                className={cn(
                  "flex w-full items-center gap-3 py-3 text-left transition-colors",
                  selectedId === r.place.id ? "text-coral" : "hover:text-coral",
                )}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PLACE_COLORS[r.place.kind] }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{r.place.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-foreground/55">
                    <RowMeta row={r} />
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-foreground/30" aria-hidden />
              </button>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="py-10 text-center text-sm text-foreground/60">
              {t("empty")}{" "}
              <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="font-semibold text-coral hover:underline">
                {t("clear")}
              </button>
            </li>
          )}
        </ul>

        <Link
          href="/routes"
          className="flex shrink-0 items-center gap-3 border-t border-border px-4 py-3 text-sm hover:text-coral md:px-5"
        >
          <Footprints className="h-4 w-4 text-coral" aria-hidden />
          <span className="flex-1">{t("routesLink", { count: routeCount })}</span>
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}

function useStatusText() {
  const t = useTranslations("map")
  return (status: OpenStatus | null) => {
    if (!status) return null
    if (status.open) return t("openUntil", { time: formatClock(status.closesAt) })
    if (status.opensAt != null) return t("closedOpensAt", { time: formatClock(status.opensAt) })
    return t("closedToday")
  }
}

function RowMeta({ row }: { row: PlaceRow }) {
  const t = useTranslations("map")
  const locale = useLocale()
  const statusText = useStatusText()
  const parts: React.ReactNode[] = []
  if (row.distance != null) parts.push(<span key="d">{formatDistance(row.distance, locale)}</span>)
  parts.push(<span key="k">{t(`kinds.${row.place.kind}`)}</span>)
  if (row.place.barrio) parts.push(<span key="b">{row.place.barrio}</span>)
  const st = statusText(row.status)
  if (st)
    parts.push(
      <span key="s" data-open-status={row.status?.open ? "open" : "closed"} className={row.status?.open ? "text-forest" : undefined}>
        {st}
      </span>,
    )
  return <>{parts.flatMap((p, i) => (i ? [" · ", p] : [p]))}</>
}

function PlaceCard({ row, onClose }: { row: PlaceRow; onClose: () => void }) {
  const t = useTranslations("map")
  const statusText = useStatusText()
  const { place, status } = row
  const st = statusText(status)
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${place.position.lat},${place.position.lng}`

  return (
    <article
      data-place-card={place.id}
      className="absolute inset-x-3 bottom-3 z-[1000] overflow-hidden rounded-2xl bg-card text-card-foreground shadow-xl md:inset-x-auto md:left-4 md:w-[360px]"
    >
      {place.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={place.image} alt="" className="h-28 w-full object-cover" loading="lazy" />
      )}
      <div className="relative p-4">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-2 top-2 rounded-full p-1.5 text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="mb-1 flex items-center gap-1.5 pr-8 text-xs font-semibold uppercase tracking-wide" style={{ color: PLACE_COLORS[place.kind] }}>
          <span className="h-2 w-2 rounded-full" style={{ background: PLACE_COLORS[place.kind] }} />
          {t(`kinds.${place.kind}`)}
          {place.barrio && <span className="font-normal normal-case tracking-normal text-foreground/50">· {place.barrio}</span>}
        </p>
        <h3 className="pr-8 font-serif text-lg font-bold leading-tight">{place.name}</h3>
        {st && <p className={cn("mt-1 text-sm font-medium", status?.open ? "text-forest" : "text-foreground/60")}>{st}</p>}
        {place.subtitle && <p className="mt-1 line-clamp-3 text-sm text-foreground/70">{place.subtitle}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3.5 py-2 text-sm font-semibold text-white hover:bg-coral-dark"
          >
            <Navigation className="h-4 w-4" aria-hidden />
            {t("directions")}
          </a>
          <Link
            href={{ pathname: "/map/3d", query: { place: place.id } }}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-2 text-sm font-semibold hover:border-foreground/30"
          >
            <Box className="h-4 w-4" aria-hidden />
            {t("view3dShort")}
          </Link>
          {place.href && (
            <Link href={place.href} className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline">
              {t("details")} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
