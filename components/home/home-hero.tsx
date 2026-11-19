import { ArrowRight, Box, Clock } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { RampartDivider } from "@/components/ui/rampart-divider"

/**
 * Hero del inicio: foto real a sangre, texto a la izquierda sobre una franja de
 * tinta (legible al sol, sin blur) y salidas a lo que existe hoy.
 */
export async function HomeHero() {
  const t = await getTranslations("home.hero")
  return (
    <section className="relative flex min-h-[72svh] flex-col justify-end overflow-hidden md:min-h-[78vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/cartagena-de-indias-colonial-walls-sunset-caribbea.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/0" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent md:hidden" aria-hidden />

      <div className="container relative z-10 mx-auto px-4 pb-14 pt-28 text-white md:pb-20">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium text-white/85">{t("kicker")}</p>
          <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-balance md:text-7xl">{t("title")}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/90 text-pretty md:text-xl">{t("subtitle")}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/map#mapa"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-base font-semibold text-ink shadow-lg transition hover:bg-coral-dark active:translate-y-px"
            >
              <Clock className="h-5 w-5" aria-hidden />
              {t("ctaOpen")}
            </Link>
            <Link
              href="/map/3d"
              className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:bg-white hover:text-ink active:translate-y-px"
            >
              <Box className="h-5 w-5" aria-hidden />
              {t("cta3d")}
            </Link>
            <Link href="/routes" className="inline-flex items-center gap-1 px-2 py-3 font-semibold text-white underline-offset-4 hover:underline">
              {t("ctaRoutes")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
      <RampartDivider className="relative z-10" color="var(--background)" />
    </section>
  )
}
