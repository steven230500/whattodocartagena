import type { Event } from "@/lib/types/commerce";

/** Opcionales para filtros ya existentes */
export const COMMERCE_TYPES = {
  food: "Gastronomía",
  artisan: "Artesanías",
  mall: "Centro comercial",
  service: "Servicios",
  shop: "Tienda",
  culture: "Cultura",
};
export const NEIGHBORHOODS = [
  "Centro Histórico",
  "Getsemaní",
  "San Diego",
  "Bocagrande",
  "Manga",
  "Crespo",
];

export const EVENT_TYPES = {
  feria: "Feria",
  gastronomia: "Gastronomía",
  concierto: "Concierto",
  festival: "Festival",
  cultural: "Cultural",
  deportivo: "Deportivo",
  mall_event: "Evento en centro comercial",
} satisfies Record<Event["type"] | "deportivo", string>;
