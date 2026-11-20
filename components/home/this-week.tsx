import { ArrowRight } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import type { Event } from "@/lib/types/commerce"

const DAY_MS = 86_400_000

/**
 * "Esta semana": solo eventos con fecha en los próximos 7 días, cargados desde
 * el admin. Los planes recurrentes no se muestran en el inicio: venían de datos
 * de ejemplo sin verificar (horarios y precios inventados). Sin eventos, la
 * sección no aparece.
 */
export async function ThisWeek({ events, now }: { events: Event[]; now: number }) {
  const t = await getTranslations("home.week")
  const locale = await getLocale()
  const fmt = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "America/Bogota",
  })

  const items = events
    .filter((e) => {
      const start = Date.parse(e.startDate)
      const end = e.endDate ? Date.parse(e.endDate) : start
      return Number.isFinite(start) && end >= now - DAY_MS && start <= now + 7 * DAY_MS
    })
    .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
    .slice(0, 5)
    .map((e) => ({
      key: e.slug,
      when: fmt.format(new Date(e.startDate)),
      title: (locale === "en" && e.titleEn) || e.title,
      where: e.venue,
      href: `/events/${e.slug}`,
    }))

  if (items.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-16 md:py-20" aria-labelledby="week-title">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
        <div>
          <h2 id="week-title" className="font-serif text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-2 max-w-sm text-foreground/70">{t("subtitle")}</p>
          <Link href="/events" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-coral-ink hover:underline">
            {t("events")} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
          {items.map((it) => (
            <li key={it.key}>
              <Link href={it.href} className="group grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
                <span className="text-sm font-medium text-foreground/70 first-letter:uppercase">{it.when}</span>
                <span className="min-w-0">
                  <span className="block font-medium leading-snug group-hover:text-coral-ink">{it.title}</span>
                  {it.where && <span className="mt-0.5 block truncate text-sm text-foreground/70">{it.where}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
