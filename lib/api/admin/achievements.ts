import { API_URL } from "../config"

export interface AdminAchievement {
  id: string
  code: string
  title: string
  description: string
  icon: string
  criteriaType: string
  threshold: number
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

function toAchievement(a: ApiAchievement): AdminAchievement {
  return {
    id: a.id,
    code: a.code,
    title: a.title,
    description: a.description,
    icon: a.icon,
    criteriaType: a.criteria_type,
    threshold: a.threshold,
  }
}

export async function getAdminAchievements(): Promise<AdminAchievement[]> {
  const res = await fetch(`${API_URL}/api/achievements`, { cache: "no-store" })
  if (!res.ok) throw new Error(`getAdminAchievements: ${res.status}`)
  const data: ApiAchievement[] = await res.json()
  return data.map(toAchievement)
}

export async function getAdminAchievementById(id: string): Promise<AdminAchievement | null> {
  const all = await getAdminAchievements()
  return all.find((a) => a.id === id) ?? null
}
