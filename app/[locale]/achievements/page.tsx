import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Header } from "@/components/navigation/header"
import { AchievementsGrid } from "@/components/gamification/achievements-grid"
import { AchievementsHero } from "@/components/gamification/achievements-hero"
import { UserProgress } from "@/components/gamification/user-progress"
import { getCurrentUser } from "@/lib/api/auth"
import { getAchievementProgress } from "@/lib/api/achievements"

export const dynamic = "force-dynamic"

export default async function AchievementsPage() {
  const [user, t] = await Promise.all([getCurrentUser(), getTranslations("achievementsPage")])
  if (!user) {
    // sin sesión: explicar qué son los logros en vez de un login sin contexto
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <AchievementsHero />
          <section className="container mx-auto max-w-2xl px-4 py-14 text-center">
            <h2 className="font-serif text-3xl font-bold">{t("guestTitle")}</h2>
            <p className="mt-3 text-lg text-muted-foreground text-pretty">{t("guestBody")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={{ pathname: "/login", query: { next: "/achievements" } }}
                className="rounded-full bg-coral px-6 py-3 font-semibold text-ink hover:bg-coral-dark"
              >
                {t("login")}
              </Link>
              <Link href="/routes" className="px-2 py-3 font-semibold text-coral-ink hover:underline">
                {t("explore")}
              </Link>
            </div>
          </section>
        </main>
      </div>
    )
  }

  const progress = await getAchievementProgress()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AchievementsHero />
        {progress ? (
          <>
            <UserProgress achievements={progress.achievements} stats={progress.stats} />
            <AchievementsGrid achievements={progress.achievements} />
          </>
        ) : (
          <p className="text-center text-muted-foreground py-20">{t("loadError")}</p>
        )}
      </main>
    </div>
  )
}
