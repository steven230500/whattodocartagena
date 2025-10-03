"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, MapPin, Clock, Target, Award } from "lucide-react"

const userStats = {
  level: 8,
  xp: 2450,
  nextLevelXp: 3000,
  totalCollectibles: 47,
  maxCollectibles: 85,
  routesCompleted: 12,
  totalRoutes: 25,
  timeSpent: "24h 30m",
  achievements: 15,
}

const recentAchievements = [
  {
    id: 1,
    title: "Explorador del Centro",
    description: "Completaste todas las rutas del centro histórico",
    icon: MapPin,
    color: "bg-coral",
    unlockedAt: "Hace 2 días",
  },
  {
    id: 2,
    title: "Conocedor Gastronómico",
    description: "Visitaste 10 restaurantes tradicionales",
    icon: Trophy,
    color: "bg-colonial-gold",
    unlockedAt: "Hace 1 semana",
  },
  {
    id: 3,
    title: "Historiador Novato",
    description: "Escuchaste 20 audio-guías completas",
    icon: Clock,
    color: "bg-caribbean-blue",
    unlockedAt: "Hace 2 semanas",
  },
]

export function UserProgress() {
  const progressPercentage = (userStats.xp / userStats.nextLevelXp) * 100
  const collectiblesPercentage = (userStats.totalCollectibles / userStats.maxCollectibles) * 100
  const routesPercentage = (userStats.routesCompleted / userStats.totalRoutes) * 100

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Tu Progreso</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Sigue explorando para desbloquear más tesoros y logros
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Level & XP */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-coral-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-serif text-2xl">Nivel {userStats.level}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Experiencia</span>
                    <span>
                      {userStats.xp} / {userStats.nextLevelXp} XP
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {userStats.nextLevelXp - userStats.xp} XP para el siguiente nivel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collectibles */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-colonial-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-serif text-2xl">Coleccionables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Encontrados</span>
                    <span>
                      {userStats.totalCollectibles} / {userStats.maxCollectibles}
                    </span>
                  </div>
                  <Progress value={collectiblesPercentage} className="h-3" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {Math.round(collectiblesPercentage)}% de la colección completa
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Routes */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-caribbean-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-serif text-2xl">Rutas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completadas</span>
                    <span>
                      {userStats.routesCompleted} / {userStats.totalRoutes}
                    </span>
                  </div>
                  <Progress value={routesPercentage} className="h-3" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {userStats.totalRoutes - userStats.routesCompleted} rutas por explorar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-serif text-2xl flex items-center space-x-2">
              <Award className="w-6 h-6 text-coral" />
              <span>Logros Recientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentAchievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <div key={achievement.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                    <div className={`w-12 h-12 rounded-xl ${achievement.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <Badge variant="outline" className="text-xs bg-transparent">
                        {achievement.unlockedAt}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
