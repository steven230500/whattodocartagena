import { Home, Clock, Map, Route, Sparkles, Music, Calendar, Store, Church, TrendingUp, Gift, Box } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Locale = "es" | "en"

export type NavPrimaryKey = "home" | "history" | "map" | "routes" | "explore"

export type NavGroupKey =
  | "groups.livingCulture"
  | "groups.agenda"
  | "groups.localCommerce"
  | "groups.usefulServices"
  | "groups.shortcuts"

export type NavItemKey =
  | NavPrimaryKey
  | "items.culture"
  | "items.gastronomy"
  | "items.events"
  | "items.localPlans"
  | "items.businesses"
  | "items.shoppingCenters"
  | "items.massSchedules"
  | "items.city3d"
  | "items.todayNearYou"
  | "items.freeThisWeekend"

export interface NavItem {
  key: NavItemKey
  label: string
  labelEn: string
  href: string
  icon?: LucideIcon
}

export interface NavGroup {
  key: NavGroupKey
  group: string
  groupEn: string
  items: NavItem[]
}

export interface NavPrimaryItem {
  key: NavPrimaryKey
  label: string
  labelEn: string
  href?: string
  icon?: LucideIcon
  children?: NavGroup[]
}

export const NAV_PRIMARY: NavPrimaryItem[] = [
  {
    key: "home",
    label: "Inicio",
    labelEn: "Home",
    href: "/",
    icon: Home,
  },
  {
    key: "history",
    label: "Historia",
    labelEn: "History",
    href: "/history",
    icon: Clock,
  },
  {
    key: "map",
    label: "Mapa",
    labelEn: "Map",
    href: "/map",
    icon: Map,
  },
  {
    key: "routes",
    label: "Rutas",
    labelEn: "Routes",
    href: "/routes",
    icon: Route,
  },
  {
    key: "explore",
    label: "Explora",
    labelEn: "Explore",
    icon: Sparkles,
    children: [
      {
        key: "groups.livingCulture",
        group: "Cultura viva",
        groupEn: "Living culture",
        items: [
          { key: "items.culture", label: "Cultura", labelEn: "Culture", href: "/explore?tag=cultura", icon: Music },
          { key: "items.gastronomy", label: "Gastronomía", labelEn: "Gastronomy", href: "/explore?tag=gastronomia", icon: Store },
        ],
      },
      {
        key: "groups.agenda",
        group: "Agenda",
        groupEn: "Events",
        items: [
          { key: "items.events", label: "Eventos", labelEn: "Events", href: "/events", icon: Calendar },
          { key: "items.localPlans", label: "Planes para locales", labelEn: "Local plans", href: "/plans", icon: TrendingUp },
        ],
      },
      {
        key: "groups.localCommerce",
        group: "Comercio local",
        groupEn: "Local commerce",
        items: [
          { key: "items.businesses", label: "Comercios", labelEn: "Businesses", href: "/businesses", icon: Store },
          { key: "items.shoppingCenters", label: "Centros comerciales", labelEn: "Shopping centers", href: "/businesses?type=mall", icon: Store },
        ],
      },
      {
        key: "groups.usefulServices",
        group: "Servicios útiles",
        groupEn: "Useful services",
        items: [{ key: "items.massSchedules", label: "Horarios de misas", labelEn: "Mass schedules", href: "/masses", icon: Church }],
      },
      {
        key: "groups.shortcuts",
        group: "Atajos",
        groupEn: "Shortcuts",
        items: [
          { key: "items.city3d", label: "Ciudad en 3D", labelEn: "City in 3D", href: "/map/3d", icon: Box },
          { key: "items.todayNearYou", label: "Hoy cerca de ti", labelEn: "Today near you", href: "/explore?near=me&when=today", icon: Map },
          {
            key: "items.freeThisWeekend",
            label: "Gratis este fin de semana",
            labelEn: "Free this weekend",
            href: "/explore?price=free&when=weekend",
            icon: Gift,
          },
        ],
      },
    ],
  },
]

export const NAV_MOBILE_BOTTOM: NavItem[] = [
  { key: "home", label: "Inicio", labelEn: "Home", href: "/", icon: Home },
  { key: "map", label: "Mapa", labelEn: "Map", href: "/map", icon: Map },
  { key: "routes", label: "Rutas", labelEn: "Routes", href: "/routes", icon: Route },
  { key: "explore", label: "Explora", labelEn: "Explore", href: "/explore", icon: Sparkles },
]
