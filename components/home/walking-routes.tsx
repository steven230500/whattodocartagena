import { ArrowRight, Box } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import type { Route } from "@/lib/api/routes"

/** Rutas a pie: tres tarjetas con foto, datos para decidir y salida al 3D. */
export async function WalkingRoutes({ routes }: { routes: Route[] }) {
  const t = await getTranslations("home.routes")
  const locale = await getLocale()
  const list = routes.filter((r) => r.steps.length > 0).slice(0, 3)
  if (list.length === 0) return null

  return (
    <section className="bg-card/60 py-16 md:py-20" aria-labelledby="routes-title">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 id="routes-title" className="font-serif text-3xl font-bold md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-foreground/70">{t("subtitle")}</p>
          </div>
          <Link href="/routes" className="inline-flex items-center gap-1 font-semibold text-coral-ink hover:underline">
            {t("all", { count: routes.length })} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {list.map((r) => {
            const title = (locale === "en" && r.titleEn) || r.title
            return (
              <li key={r.id} className="flex flex-col overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10">
                <Link href={`/routes/${r.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {r.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                    )}
                  </div>
                  <div className="p-5 pb-3">
                    <h3 className="font-serif text-xl font-bold leading-snug group-hover:text-coral-ink">{title}</h3>
                    <p className="mt-1 text-sm text-foreground/65">
                      {[r.duration, r.distance, t("stops", { count: r.steps.length })].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </Link>
                <div className="mt-auto flex items-center justify-between gap-3 px-5 pb-5">
                  <Link href={`/routes/${r.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-coral-ink">
                    {t("open")} <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href={{ pathname: "/map/3d", query: { route: r.slug } }}
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-ink"
                  >
                    <Box className="h-4 w-4" aria-hidden /> {t("in3d")}
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
