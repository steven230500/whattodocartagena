import { ArrowDown, Box } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

/**
 * Hero del mapa: foto real a sangre, texto a la izquierda sobre degradado,
 * y dos salidas claras: la ciudad en 3D o bajar al mapa.
 */
export async function MapHero() {
  const t = await getTranslations("map.hero")
  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden pt-16 md:min-h-[52vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/aerial-view-of-cartagena-historic-center-with-wall.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2A1F1A]/90 via-[#2A1F1A]/55 to-transparent" aria-hidden />
      <div className="container relative z-10 mx-auto px-4 pb-10 text-white md:pb-14">
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">{t("title")}</h1>
          <p className="mt-3 text-lg text-white/85 md:text-xl">{t("subtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/map/3d"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-semibold text-ink shadow-lg transition-colors hover:bg-coral-dark"
            >
              <Box className="h-5 w-5" aria-hidden />
              {t("cta3d")}
            </Link>
            <a
              href="#mapa"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <ArrowDown className="h-5 w-5" aria-hidden />
              {t("ctaMap")}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
