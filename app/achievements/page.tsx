import { redirect } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { AchievementsGrid } from "@/components/gamification/achievements-grid"
import { AchievementsHero } from "@/components/gamification/achievements-hero"
import { UserProgress } from "@/components/gamification/user-progress"
import { getCurrentUser } from "@/lib/api/auth"
import { getAchievementProgress } from "@/lib/api/achievements"

export default async function AchievementsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
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
          <p className="text-center text-muted-foreground py-20">No se pudo cargar tu progreso. Intentá de nuevo.</p>
        )}
      </main>
    </div>
  )
}
