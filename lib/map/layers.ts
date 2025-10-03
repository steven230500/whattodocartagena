import type { MapLayer } from "@/lib/types/commerce"

export const MAP_LAYERS: MapLayer[] = [
  {
    id: "historic",
    label: "Sitios Históricos",
    color: "#F97360",
    icon: "crown",
    active: true,
  },
  {
    id: "food",
    label: "Gastronomía",
    color: "#F7A500",
    icon: "utensils",
    active: true,
  },
  {
    id: "culture",
    label: "Cultura y Música",
    color: "#3BAFDA",
    icon: "music",
    active: true,
  },
  {
    id: "photo",
    label: "Spots Fotográficos",
    color: "#8B5CF6",
    icon: "camera",
    active: false,
  },
  {
    id: "mall",
    label: "Centros Comerciales",
    color: "#22A06B",
    icon: "store",
    active: false,
  },
  {
    id: "commerce",
    label: "Comercios",
    color: "#F59E0B",
    icon: "bag",
    active: false,
  },
]

export const COMMERCE_TYPES = {
  mall: "Centro Comercial",
  artisan: "Artesanía",
  food: "Gastronomía",
  shop: "Tienda",
  service: "Servicio",
  culture: "Cultural",
} as const

export const EVENT_TYPES = {
  festival: "Festival",
  concierto: "Concierto",
  feria: "Feria",
  mall_event: "Evento de Centro Comercial",
  gastronomia: "Gastronómico",
  cultural: "Cultural",
} as const

export const NEIGHBORHOODS = [
  "Centro Histórico",
  "Getsemaní",
  "Bocagrande",
  "Castillogrande",
  "El Laguito",
  "Manga",
  "Pie de la Popa",
] as const
