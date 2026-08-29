import { Route, Compass, Heart, Star, Trophy, type LucideIcon } from "lucide-react"

// La DB guarda una clave fija por logro, el front la mapea a un ícono real —
// mismo criterio que lib/routes/category-color.ts.
const ACHIEVEMENT_ICON: Record<string, LucideIcon> = {
  route: Route,
  compass: Compass,
  heart: Heart,
  star: Star,
}

export const ACHIEVEMENT_ICON_KEYS = Object.keys(ACHIEVEMENT_ICON)

export function achievementIcon(icon: string): LucideIcon {
  return ACHIEVEMENT_ICON[icon] ?? Trophy
}
