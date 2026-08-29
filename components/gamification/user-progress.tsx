import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Heart, Route, Award } from "lucide-react"
import type { AchievementProgress, AchievementStats } from "@/lib/api/achievements"

interface UserProgressProps {
  achievements: AchievementProgress[]
  stats: AchievementStats
}

export function UserProgress({ achievements, stats }: UserProgressProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const unlockedPercentage = achievements.length > 0 ? (unlockedCount / achievements.length) * 100 : 0

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Tu Progreso</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Seguí explorando Cartagena para desbloquear más logros.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border border-border shadow-none">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-coral" />
                <CardTitle className="font-serif text-2xl">Logros</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Desbloqueados</span>
                    <span>
                      {unlockedCount} / {achievements.length}
                    </span>
                  </div>
                  <Progress value={unlockedPercentage} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-none">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Route className="w-6 h-6 text-forest" />
                <CardTitle className="font-serif text-2xl">Rutas completadas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">{stats.routesCompleted}</p>
              <p className="text-sm text-muted-foreground mt-2">Rutas guiadas terminadas de principio a fin.</p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-none">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-6 h-6 text-colonial-gold" />
                <CardTitle className="font-serif text-2xl">Favoritos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">{stats.favoritesCount}</p>
              <p className="text-sm text-muted-foreground mt-2">Comercios guardados como favoritos.</p>
            </CardContent>
          </Card>
        </div>

        {unlockedCount > 0 && (
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="font-serif text-2xl flex items-center space-x-2">
                <Award className="w-6 h-6 text-coral" />
                <span>Logros desbloqueados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border border-t border-border">
                {achievements
                  .filter((a) => a.unlocked)
                  .map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-4 py-5">
                      <Trophy className="w-6 h-6 text-coral mt-1 shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
