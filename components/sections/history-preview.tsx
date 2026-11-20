import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

/**
 * Historia en el inicio: los cuatro hitos siempre visibles sobre un riel (antes
 * era un carrusel que escondía tres de cuatro), cada uno enlazado a su parte de
 * /history. Una sola foto real y fechada como lo que es (la ciudad de hoy), en
 * vez de fotos modernas presentadas como si fueran de 1533.
 */
const MILESTONES = [
  { key: "founding", year: "1533" },
  { key: "walls", year: "1586–1741" },
  { key: "independence", year: "1811" },
  { key: "unesco", year: "1984" },
] as const

export async function HistoryPreview() {
  const t = await getTranslations("history.preview")

  return (
    <section className="py-16 md:py-24" aria-labelledby="history-preview-title">
      <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="min-w-0">
          <h2 id="history-preview-title" className="font-serif text-3xl font-bold text-balance md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-md text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
          <figure className="mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/castillo-san-felipe-fortress-cartagena.jpg"
              alt={t("imageAlt")}
              className="aspect-[16/10] w-full rounded-2xl object-cover md:aspect-[4/5]"
              loading="lazy"
            />
            <figcaption className="mt-2 text-sm text-muted-foreground">{t("imageCaption")}</figcaption>
          </figure>
          <Link href="/history" className="mt-6 inline-flex items-center gap-1 font-semibold text-coral-ink hover:underline">
            {t("readAll")} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ol className="relative min-w-0 self-center border-l-2 border-colonial-gold/70 pl-8 md:pl-10">
          {MILESTONES.map((m) => (
            <li key={m.key} className="relative pb-10 last:pb-0">
              <span
                className="absolute -left-[2.6rem] top-3 h-4 w-4 rounded-full border-[3px] border-background bg-colonial-gold md:-left-[3.1rem]"
                aria-hidden
              />
              <Link href={`/history#hito-${m.key}`} className="group block">
                <p className="font-serif text-4xl font-bold tabular-nums leading-none text-ink md:text-5xl">{m.year}</p>
                <h3 className="mt-2 text-xl font-semibold group-hover:text-coral-ink">{t(`periods.${m.key}.title`)}</h3>
                <p className="mt-1 max-w-lg text-muted-foreground text-pretty">{t(`periods.${m.key}.description`)}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-coral-ink transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                  {t("readMore")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
