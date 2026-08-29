import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lock } from "lucide-react"
import { achievementIcon } from "@/lib/achievements/icon-map"
import type { AchievementProgress } from "@/lib/api/achievements"

interface AchievementsGridProps {
  achievements: AchievementProgress[]
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const Icon = achievementIcon(achievement.icon)
            const percent = Math.min(100, Math.round((achievement.current / achievement.threshold) * 100))

            return (
              <Card
                key={achievement.id}
                className={`border-0 shadow-lg ${
                  achievement.unlocked ? "opacity-100" : "opacity-70"
                } hover:shadow-xl transition-all duration-300`}
              >
                <CardHeader>
                  <CardTitle className="font-serif text-lg flex items-center space-x-2">
                    {achievement.unlocked ? (
                      <Icon className="w-5 h-5 text-coral" />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className={achievement.unlocked ? "text-foreground" : "text-muted-foreground"}>
                      {achievement.title}
                    </span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2 text-pretty">{achievement.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span>
                          {achievement.current}/{achievement.threshold}
                        </span>
                      </div>
                      <Progress value={percent} className="h-2" />
                    </div>

                    {achievement.unlocked && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        ¡Desbloqueado!
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
