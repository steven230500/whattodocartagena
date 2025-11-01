import type { MapLayer } from "@/lib/types/commerce";

export const MAP_LAYERS: MapLayer[] = [
  { id: "historic", label: "Sitios históricos y patrimonio", color: "#EF4444", icon: "crown" },
  { id: "food",     label: "Restaurantes y gastronomía local", color: "#F59E0B", icon: "utensils" },
  { id: "culture",  label: "Espacios culturales y música",     color: "#3B82F6", icon: "music" },
  { id: "photo",    label: "Mejores spots fotográficos",       color: "#10B981", icon: "camera" },
  { id: "mall",     label: "Centros comerciales",              color: "#16A34A", icon: "store" },
  { id: "commerce", label: "Comercios locales",                color: "#A855F7", icon: "bag" },
];

/** Opcionales para filtros ya existentes */
export const COMMERCE_TYPES = {
  food: "Gastronomía",
  artisan: "Artesanías",
  mall: "Centro comercial",
  service: "Servicios",
};
export const NEIGHBORHOODS = [
  "Centro Histórico",
  "Getsemaní",
  "San Diego",
  "Bocagrande",
  "Manga",
  "Crespo",
];
