"use client"

import { useMemo, useSyncExternalStore } from "react"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { PLACE_COLORS, formatClock, openStatus, parseHours, type Place } from "@/features/places"

const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 15_000)
  return () => window.clearInterval(id)
}
const minuteNow = () => Math.floor(Date.now() / 60_000)
const minuteOnServer = () => null

/** Hora de Cartagena (UTC−5) como HH:MM. */
const cartagenaClock = (d: Date) => formatClock(((d.getUTCHours() * 60 + d.getUTCMinutes() - 300) % 1440 + 1440) % 1440)

/**
 * "Abierto ahora": negocios con horario conocido, primero los abiertos y luego
 * los que abren más tarde hoy. En el servidor no se calcula (no sabe la hora
 * del visitante); el navegador lo completa al hidratar.
 */
export function OpenNow({ places }: { places: Place[] }) {
  const t = useTranslations("home.openNow")
  const tk = useTranslations("map.kinds")
  const minute = useSyncExternalStore(subscribe, minuteNow, minuteOnServer)
  const now = useMemo(() => (minute == null ? null : new Date(minute * 60_000)), [minute])

  const rows = useMemo(() => {
    if (!now) return []
    return places
      .map((place) => ({ place, status: openStatus(parseHours(place.hours), now) }))
      .filter((r) => r.status !== null)
      .sort((a, b) => {
        const rank = (s: typeof a.status) => (s!.open ? 0 : s!.opensAt != null ? 1 : 2)
        return rank(a.status) - rank(b.status)
      })
      .filter((r) => r.status!.open || r.status!.opensAt != null)
      .slice(0, 6)
  }, [places, now])

  if (places.every((p) => !p.hours)) return null

  return (
    <section className="container mx-auto px-4 py-16 md:py-20" aria-labelledby="open-now-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="open-now-title" className="font-serif text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-foreground/70">
            {now ? t("subtitle", { time: cartagenaClock(now) }) : t("subtitleNoTime")}
          </p>
        </div>
        <Link href="/map#mapa" className="inline-flex items-center gap-1 font-semibold text-coral-ink hover:underline">
          {t("all")} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {now && rows.length === 0 && <p className="mt-8 text-foreground/70">{t("none")}</p>}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ place, status }) => (
          <li key={place.id}>
            <Link
              href={place.href ?? "/map#mapa"}
              className="group flex h-full gap-4 rounded-2xl bg-card p-3 ring-1 ring-foreground/10 transition hover:ring-foreground/25"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                {place.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={place.image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                ) : (
                  <span className="block h-full w-full" style={{ background: PLACE_COLORS[place.kind] }} />
                )}
              </div>
              <div className="min-w-0 py-1">
                <p className="flex items-center gap-1.5 text-xs font-medium text-foreground/70">
                  <span className="h-2 w-2 rounded-full" style={{ background: PLACE_COLORS[place.kind] }} />
                  {tk(place.kind)}
                  {place.barrio && <span>· {place.barrio}</span>}
                </p>
                <h3 className="mt-1 truncate font-serif text-lg font-bold leading-snug group-hover:text-coral-ink">{place.name}</h3>
                <p className={cn("mt-1 text-sm font-medium", status!.open ? "text-forest" : "text-foreground/70")}>
                  {status!.open
                    ? t("openUntil", { time: formatClock(status!.closesAt) })
                    : t("opensAt", { time: formatClock(status!.opensAt!) })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
