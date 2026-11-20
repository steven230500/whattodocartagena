import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { ChapterIndex } from "./chapter-index"

type Layout = "imageRight" | "imageLeft" | "wide"
type ChapterKey = "founding" | "walls" | "siege1741" | "independence" | "morillo" | "unesco"

/**
 * /history como capítulos editoriales: el año grande abre cada capítulo, el
 * texto a ancho de lectura y fotos de distinto tamaño que alternan de lado
 * (una a todo el ancho). Sin tarjetas con borde: antes eran seis cajas
 * idénticas apiladas. Las fotos son de la ciudad de hoy y el pie lo dice.
 */
const CHAPTERS: {
  key: ChapterKey
  year: string
  image: string
  layout: Layout
  aspect: string
  /** solo donde el lugar se puede ver en la ciudad 3D */
  in3d?: string
}[] = [
  { key: "founding", year: "1533", image: "/aerial-view-of-cartagena-historic-center-with-wall.jpg", layout: "imageRight", aspect: "aspect-[4/5]" },
  { key: "walls", year: "1586–1741", image: "/cartagena-colonial-walls-construction-fortress.jpg", layout: "imageLeft", aspect: "aspect-[3/2]", in3d: "/map/3d" },
  { key: "siege1741", year: "1741", image: "/cartagena-city-walls-fortifications.jpg", layout: "wide", aspect: "aspect-[21/9]", in3d: "/map/3d?place=poi-castillo-san-felipe" },
  { key: "independence", year: "1811", image: "/cartagena-independence-1811-heroic-city.jpg", layout: "imageLeft", aspect: "aspect-[4/5]" },
  { key: "morillo", year: "1815–1821", image: "/castillo-san-felipe-fortress-cartagena.jpg", layout: "imageRight", aspect: "aspect-[3/2]" },
  { key: "unesco", year: "1984", image: "/cartagena-unesco-world-heritage-historic-center.jpg", layout: "wide", aspect: "aspect-[21/9]", in3d: "/map/3d" },
]

export async function HistoryChapters() {
  const t = await getTranslations("timeline")
  const chapters = CHAPTERS.map((c) => ({ ...c, id: `hito-${c.key}`, title: t(`events.${c.key}.title`) }))

  return (
    <section className="bg-background py-12 md:py-20" aria-labelledby="chapters-title">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl md:ml-[12rem]">
          <h2 id="chapters-title" className="font-serif text-3xl font-bold text-balance md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
        </div>

        {/* bloque en celular (el índice queda fijo bajo la cabecera), grilla en escritorio */}
        <div className="mt-8 md:mt-14 md:grid md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
          <ChapterIndex chapters={chapters.map(({ id, year, title }) => ({ id, year, title }))} label={t("indexLabel")} />

          <div className="mt-10 min-w-0 space-y-24 md:mt-0 md:space-y-32">
            {chapters.map((c) => {
              const facts = [t(`events.${c.key}.fact1`), t(`events.${c.key}.fact2`), t(`events.${c.key}.fact3`)]
              const text = (
                <div className="min-w-0">
                  <p className="font-serif text-6xl font-bold leading-none tabular-nums text-ink md:text-8xl">{c.year}</p>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-foreground/70">
                    {t(`events.${c.key}.category`)}
                  </p>
                  <h3 className="mt-1 font-serif text-3xl font-bold leading-tight text-balance md:text-4xl">{t(`events.${c.key}.title`)}</h3>
                  <p className="mt-2 font-serif text-xl italic text-coral-ink">{t(`events.${c.key}.subtitle`)}</p>
                  <p className="mt-5 max-w-prose text-lg leading-relaxed text-foreground/85 text-pretty">
                    {t(`events.${c.key}.description`)}
                  </p>
                  <ul className="mt-6 grid max-w-prose gap-x-6 gap-y-3 border-t border-foreground/15 pt-4 sm:grid-cols-3">
                    {facts.map((f) => (
                      <li key={f} className="text-sm leading-snug text-foreground/80">
                        <span className="mb-2 block h-0.5 w-6 bg-colonial-gold" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {c.in3d && (
                    <Link href={c.in3d} className="mt-6 inline-flex items-center gap-1 font-semibold text-coral-ink hover:underline">
                      {t("in3d")} <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  )}
                </div>
              )
              const figure = (
                <figure className="min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={t(`events.${c.key}.imageAlt`)}
                    className={cn("w-full rounded-2xl object-cover", c.aspect)}
                    loading="lazy"
                  />
                  <figcaption className="mt-2 text-sm text-muted-foreground">{t(`events.${c.key}.caption`)}</figcaption>
                </figure>
              )

              return (
                <article key={c.key} id={c.id} className="scroll-mt-32 md:scroll-mt-28">
                  {c.layout === "wide" ? (
                    <div className="space-y-8">
                      <div className="max-w-3xl">{text}</div>
                      {figure}
                    </div>
                  ) : (
                    <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                      <div className={cn("lg:col-span-6", c.layout === "imageLeft" ? "lg:order-2" : "lg:order-1")}>{text}</div>
                      <div className={cn("lg:col-span-6", c.layout === "imageLeft" ? "lg:order-1" : "lg:order-2")}>{figure}</div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
