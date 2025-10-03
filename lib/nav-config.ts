import { Home, Clock, Map, Route, Sparkles, Music, Calendar, Store, Church, TrendingUp, Gift } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Locale = "es" | "en"

export interface NavItem {
  label: string
  labelEn: string
  href: string
  icon?: LucideIcon
}

export interface NavGroup {
  group: string
  groupEn: string
  items: NavItem[]
}

export interface NavPrimaryItem {
  label: string
  labelEn: string
  href?: string
  icon?: LucideIcon
  children?: NavGroup[]
}

export const NAV_PRIMARY: NavPrimaryItem[] = [
  {
    label: "Inicio",
    labelEn: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Historia",
    labelEn: "History",
    href: "/history",
    icon: Clock,
  },
  {
    label: "Mapa",
    labelEn: "Map",
    href: "/map",
    icon: Map,
  },
  {
    label: "Rutas",
    labelEn: "Routes",
    href: "/routes",
    icon: Route,
  },
  {
    label: "Explora",
    labelEn: "Explore",
    icon: Sparkles,
    children: [
      {
        group: "Cultura viva",
        groupEn: "Living Culture",
        items: [
          { label: "Cultura", labelEn: "Culture", href: "/cultura", icon: Music },
          { label: "Gastronomía", labelEn: "Gastronomy", href: "/explore?tag=gastronomia", icon: Store },
        ],
      },
      {
        group: "Agenda",
        groupEn: "Events",
        items: [
          { label: "Eventos", labelEn: "Events", href: "/events", icon: Calendar },
          { label: "Planes para locales", labelEn: "Local Plans", href: "/plans", icon: TrendingUp },
        ],
      },
      {
        group: "Comercio local",
        groupEn: "Local Commerce",
        items: [
          { label: "Comercios", labelEn: "Businesses", href: "/businesses", icon: Store },
          { label: "Centros comerciales", labelEn: "Shopping Centers", href: "/businesses?type=mall", icon: Store },
        ],
      },
      {
        group: "Servicios útiles",
        groupEn: "Useful Services",
        items: [{ label: "Horarios de misas", labelEn: "Mass Schedules", href: "/masses", icon: Church }],
      },
      {
        group: "Atajos",
        groupEn: "Shortcuts",
        items: [
          { label: "Hoy cerca de ti", labelEn: "Today Near You", href: "/explore?near=me&when=today", icon: Map },
          {
            label: "Gratis este fin de semana",
            labelEn: "Free This Weekend",
            href: "/explore?price=free&when=weekend",
            icon: Gift,
          },
        ],
      },
    ],
  },
]

export const NAV_MOBILE_BOTTOM: NavItem[] = [
  { label: "Inicio", labelEn: "Home", href: "/", icon: Home },
  { label: "Mapa", labelEn: "Map", href: "/map", icon: Map },
  { label: "Rutas", labelEn: "Routes", href: "/routes", icon: Route },
  { label: "Explora", labelEn: "Explore", href: "/explore", icon: Sparkles },
]
