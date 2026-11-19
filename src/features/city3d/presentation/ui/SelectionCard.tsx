"use client"

import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useExplorer } from "../state"
import { PLACE_COLORS, SURFACES } from "../palette"
import { cn } from "@/lib/utils"

/** Detalle de lo seleccionado: lugar, edificio o parada de la ruta. */
export function SelectionCard({ className }: { className?: string }) {
  const t = useTranslations("city3d.selection")
  const tk = useTranslations("city3d.kinds")
  const { model, places, routes, state, dispatch } = useExplorer()
  const sel = state.selection
  if (!sel) return null

  const close = (
    <button
      type="button"
      onClick={() => dispatch({ type: "select", selection: null })}
      className="absolute right-2 top-2 rounded-full p-1.5 text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
      aria-label={t("close")}
    >
      <X className="h-4 w-4" />
    </button>
  )

  if (sel.type === "place") {
    const p = places.find((x) => x.id === sel.id)
    if (!p) return null
    return (
      <article className={cn("relative overflow-hidden rounded-2xl bg-card text-card-foreground shadow-xl", className)}>
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt="" className="h-28 w-full object-cover" loading="lazy" />
        )}
        <div className="p-4 pr-10">
          {close}
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: PLACE_COLORS[p.kind] }}>
            <span className="h-2 w-2 rounded-full" style={{ background: PLACE_COLORS[p.kind] }} />
            {tk(p.kind)}
          </p>
          <h3 className="font-serif text-lg font-bold leading-tight">{p.name}</h3>
          {p.subtitle && <p className="mt-1 line-clamp-3 text-sm text-foreground/70">{p.subtitle}</p>}
          {p.href && (
            <Link href={p.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline">
              {t("details")} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </article>
    )
  }

  if (sel.type === "building") {
    const b = model.buildings[sel.id]
    if (!b) return null
    const barrio = model.barrios[b.barrio]?.name
    const floors = Math.max(1, Math.round((b.height - 1) / 4))
    return (
      <article className={cn("relative rounded-2xl bg-card p-4 pr-10 text-card-foreground shadow-xl", className)}>
        {close}
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/50">{t("building")}</p>
        <h3 className="font-serif text-lg font-bold leading-tight">{b.name ?? (barrio ? t("in", { barrio }) : t("building"))}</h3>
        <p className="mt-1 text-sm text-foreground/70">{t("floors", { n: floors })}</p>
      </article>
    )
  }

  const route = routes.find((r) => r.id === state.routeId)
  const stop = route?.stops[sel.index]
  if (!route || !stop) return null
  const total = route.stops.length
  return (
    <article className={cn("relative rounded-2xl bg-card p-4 text-card-foreground shadow-xl", className)}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: SURFACES.route }}>
        {t("stop", { n: sel.index + 1, total })}
      </p>
      <h3 className="font-serif text-lg font-bold leading-tight">{stop.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          disabled={sel.index === 0}
          onClick={() => dispatch({ type: "stop", index: sel.index - 1 })}
          className="rounded-full border border-foreground/15 p-1.5 disabled:opacity-30"
          aria-label={t("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={sel.index >= total - 1}
          onClick={() => dispatch({ type: "stop", index: sel.index + 1 })}
          className="rounded-full border border-foreground/15 p-1.5 disabled:opacity-30"
          aria-label={t("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <Link
          href={`/routes/${route.slug}`}
          className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline"
        >
          {t("openRoute")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
