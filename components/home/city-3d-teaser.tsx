import { ArrowRight, Box } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { RampartDivider } from "@/components/ui/rampart-divider"

/** Franja del mapa 3D: captura real de la propia vista 3D, no una ilustración. */
export async function City3DTeaser() {
  const t = await getTranslations("home.city3d")
  return (
    <section className="relative overflow-hidden bg-ink text-white" aria-labelledby="city3d-title">
      <RampartDivider color="var(--background)" className="rotate-180" />
      <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:py-20">
        <div>
          <h2 id="city3d-title" className="font-serif text-3xl font-bold leading-tight md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-white/85 text-pretty">{t("body")}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/map/3d"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-semibold text-ink transition hover:bg-coral-dark active:translate-y-px"
            >
              <Box className="h-5 w-5" aria-hidden /> {t("cta")}
            </Link>
            <Link href="/map" className="inline-flex items-center gap-1 font-semibold text-white/90 underline-offset-4 hover:underline">
              {t("classic")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
        <Link href="/map/3d" className="group block overflow-hidden rounded-2xl ring-1 ring-white/15" tabIndex={-1} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/map3d-preview.jpg"
            alt=""
            className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </Link>
      </div>
    </section>
  )
}
