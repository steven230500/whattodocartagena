import { API_URL } from "./config"
import { getUserToken } from "./auth"

export interface Achievement {
  id: string
  code: string
  title: string
  description: string
  icon: string
  criteriaType: string
  threshold: number
}

export interface AchievementProgress extends Achievement {
  current: number
  unlocked: boolean
}

export interface AchievementStats {
  routesCompleted: number
  favoritesCount: number
}

interface ApiAchievement {
  id: string
  code: string
  title: string
  description: string
  icon: string
  criteria_type: string
  threshold: number
}

interface ApiAchievementProgress extends ApiAchievement {
  current: number
  unlocked: boolean
}

interface ApiAchievementStats {
  routes_completed: number
  favorites_count: number
}

function toAchievementProgress(a: ApiAchievementProgress): AchievementProgress {
  return {
    id: a.id,
    code: a.code,
    title: a.title,
    description: a.description,
    icon: a.icon,
    criteriaType: a.criteria_type,
    threshold: a.threshold,
    current: a.current,
    unlocked: a.unlocked,
  }
}

// getAchievementProgress asume que ya hay sesión (la página redirige a /login
// antes de llamarla, igual que /favorites) — devuelve null solo si el fetch falla.
export async function getAchievementProgress(): Promise<{
  achievements: AchievementProgress[]
  stats: AchievementStats
} | null> {
  const token = await getUserToken()
  if (!token) return null

  const res = await fetch(`${API_URL}/api/me/achievements`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null

  const data: { achievements: ApiAchievementProgress[]; stats: ApiAchievementStats } = await res.json()
  return {
    achievements: data.achievements.map(toAchievementProgress),
    stats: {
      routesCompleted: data.stats.routes_completed,
      favoritesCount: data.stats.favorites_count,
    },
  }
}
