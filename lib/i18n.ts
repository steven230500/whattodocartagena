export type Locale = "es" | "en"

export const defaultLocale: Locale = "es"

export const locales: Locale[] = ["es", "en"]

export const translations = {
  es: {
    // Navigation
    "nav.history": "Historia",
    "nav.map": "Mapa",
    "nav.routes": "Rutas",
    "nav.culture": "Cultura",
    "nav.collectibles": "Coleccionables",
    "nav.commerce": "Comercios",
    "nav.events": "Eventos",

    // Home page
    "home.hero.title": "Descubre la magia de Cartagena",
    "home.hero.subtitle":
      "Una experiencia cultural inmersiva que te lleva a través de 500 años de historia, tradiciones y secretos de la Ciudad Heroica.",
    "home.hero.cta": "Comenzar Exploración",
    "home.features.title": "Una experiencia completa",
    "home.features.subtitle":
      "Combina tecnología moderna con narrativas auténticas para crear la guía cultural más completa de Cartagena.",

    // Features
    "features.timeline.title": "Línea de Tiempo Interactiva",
    "features.timeline.description": "Viaja a través de 500 años de historia desde la fundación hasta hoy",
    "features.map.title": "Mapas con Capas Históricas",
    "features.map.description": "Explora diferentes épocas y descubre cómo cambió la ciudad",
    "features.audio.title": "Audio Guías Inmersivas",
    "features.audio.description": "Escucha relatos narrados por locales y expertos en historia",
    "features.palenque.title": "Historias de Palenque",
    "features.palenque.description": "Conoce la herencia afrodescendiente y la lucha por la libertad",
    "features.ar.title": "Realidad Aumentada",
    "features.ar.description": "Ve cómo lucían los lugares históricos en diferentes épocas",

    // History page
    "history.hero.title": "Viaja a través del tiempo",
    "history.hero.subtitle": "Descubre los momentos que forjaron la identidad de Cartagena de Indias",
    "history.timeline.title": "Línea de Tiempo Histórica",

    // Map page
    "map.hero.title": "Explora Cartagena",
    "map.hero.subtitle": "Descubre lugares históricos, gastronómicos y culturales con nuestro mapa interactivo",
    "map.layers.historical": "Sitios Históricos",
    "map.layers.gastronomy": "Gastronomía",
    "map.layers.culture": "Cultura",
    "map.layers.photography": "Spots Fotográficos",
    "map.layers.commerce": "Comercios",
    "map.layers.mall": "Centros Comerciales",
    "map.layers.historic": "Sitios Históricos",

    // Routes page
    "routes.hero.title": "Rutas Caminables",
    "routes.hero.subtitle": "Explora Cartagena a pie con nuestras rutas temáticas guiadas",
    "routes.filter.all": "Todas",
    "routes.filter.history": "Historia",
    "routes.filter.food": "Gastronomía",
    "routes.filter.culture": "Cultura",
    "routes.filter.nature": "Paisajes",
    "routes.filter.art": "Arte",
    "routes.filter.fortress": "Fortalezas",

    // Commerce
    "commerce.title": "Comercios Locales",
    "commerce.subtitle": "Descubre artesanos, restaurantes y tiendas auténticas de Cartagena",
    "commerce.filters.type": "Tipo",
    "commerce.filters.subtype": "Subtipo",
    "commerce.filters.neighborhood": "Barrio",
    "commerce.filters.price": "Precio",
    "commerce.filters.all": "Todos",
    "commerce.types.mall": "Centro Comercial",
    "commerce.types.artisan": "Artesanía",
    "commerce.types.food": "Gastronomía",
    "commerce.types.shop": "Tienda",
    "commerce.types.service": "Servicio",
    "commerce.types.culture": "Cultural",

    // Events
    "events.title": "Eventos",
    "events.subtitle": "Descubre festivales, conciertos y eventos culturales en Cartagena",
    "events.upcoming": "Próximos Eventos",
    "events.past": "Eventos Pasados",
    "events.types.festival": "Festival",
    "events.types.concierto": "Concierto",
    "events.types.feria": "Feria",
    "events.types.mall_event": "Evento de Centro Comercial",
    "events.types.gastronomia": "Gastronómico",
    "events.types.cultural": "Cultural",

    // Plans
    "plans.title": "Planes para Locales",
    "plans.subtitle": "Descubre las mejores actividades y eventos para disfrutar el fin de semana en Cartagena",
    "plans.updated": "Actualizado semanalmente",
    "plans.allNeighborhoods": "Todos los barrios",
    "plans.freeAndPaid": "Gratis y pagos",
    "plans.filters.type": "Tipo de plan",
    "plans.filters.price": "Precio",
    "plans.filters.all": "Todos",
    "plans.types.cultural": "Cultural",
    "plans.types.gastronomic": "Gastronómico",
    "plans.types.outdoor": "Al aire libre",
    "plans.types.nightlife": "Vida nocturna",
    "plans.types.shopping": "Compras",
    "plans.price.free": "Gratis",
    "plans.price.paid": "Pago",

    // Mass Schedules
    "mass.title": "Horarios de Misas",
    "mass.subtitle": "Información actualizada de horarios de misas en las principales parroquias de Cartagena",
    "mass.updated": "Actualizado mensualmente",
    "mass.mainParishes": "Principales parroquias",

    // Common
    "common.duration": "Duración",
    "common.difficulty": "Dificultad",
    "common.points": "puntos de interés",
    "common.start": "Comenzar Ruta",
    "common.easy": "Fácil",
    "common.moderate": "Moderado",
    "common.hard": "Difícil",
    "common.minutes": "min",
    "common.hours": "h",
    "cta.viewOnMap": "Ver en el mapa",
    "cta.contact": "Contactar",
    "cta.visit": "Visitar",
    "cta.getDirections": "Cómo llegar",
    "cta.viewDetails": "Ver detalles",
    "common.clearFilters": "Limpiar filtros",
  },
  en: {
    // Navigation
    "nav.history": "History",
    "nav.map": "Map",
    "nav.routes": "Routes",
    "nav.culture": "Culture",
    "nav.collectibles": "Collectibles",
    "nav.commerce": "Commerce",
    "nav.events": "Events",

    // Home page
    "home.hero.title": "Discover the magic of Cartagena",
    "home.hero.subtitle":
      "An immersive cultural experience that takes you through 500 years of history, traditions and secrets of the Heroic City.",
    "home.hero.cta": "Start Exploration",
    "home.features.title": "A complete experience",
    "home.features.subtitle":
      "Combines modern technology with authentic narratives to create the most complete cultural guide to Cartagena.",

    // Features
    "features.timeline.title": "Interactive Timeline",
    "features.timeline.description": "Travel through 500 years of history from foundation to today",
    "features.map.title": "Maps with Historical Layers",
    "features.map.description": "Explore different eras and discover how the city changed",
    "features.audio.title": "Immersive Audio Guides",
    "features.audio.description": "Listen to stories narrated by locals and history experts",
    "features.palenque.title": "Palenque Stories",
    "features.palenque.description": "Learn about Afro-descendant heritage and the fight for freedom",
    "features.ar.title": "Augmented Reality",
    "features.ar.description": "See how historical places looked in different eras",

    // History page
    "history.hero.title": "Travel through time",
    "history.hero.subtitle": "Discover the moments that forged the identity of Cartagena de Indias",
    "history.timeline.title": "Historical Timeline",

    // Map page
    "map.hero.title": "Explore Cartagena",
    "map.hero.subtitle": "Discover historical, gastronomic and cultural places with our interactive map",
    "map.layers.historical": "Historical Sites",
    "map.layers.gastronomy": "Gastronomy",
    "map.layers.culture": "Culture",
    "map.layers.photography": "Photo Spots",
    "map.layers.commerce": "Commerce",
    "map.layers.mall": "Shopping Malls",
    "map.layers.historic": "Historical Sites",

    // Routes page
    "routes.hero.title": "Walking Routes",
    "routes.hero.subtitle": "Explore Cartagena on foot with our guided thematic routes",
    "routes.filter.all": "All",
    "routes.filter.history": "History",
    "routes.filter.food": "Food",
    "routes.filter.culture": "Culture",
    "routes.filter.nature": "Landscapes",
    "routes.filter.art": "Art",
    "routes.filter.fortress": "Fortresses",

    // Commerce
    "commerce.title": "Local Commerce",
    "commerce.subtitle": "Discover authentic artisans, restaurants and shops in Cartagena",
    "commerce.filters.type": "Type",
    "commerce.filters.subtype": "Subtype",
    "commerce.filters.neighborhood": "Neighborhood",
    "commerce.filters.price": "Price",
    "commerce.filters.all": "All",
    "commerce.types.mall": "Shopping Mall",
    "commerce.types.artisan": "Artisan",
    "commerce.types.food": "Food",
    "commerce.types.shop": "Shop",
    "commerce.types.service": "Service",
    "commerce.types.culture": "Cultural",

    // Events
    "events.title": "Events",
    "events.subtitle": "Discover festivals, concerts and cultural events in Cartagena",
    "events.upcoming": "Upcoming Events",
    "events.past": "Past Events",
    "events.types.festival": "Festival",
    "events.types.concierto": "Concert",
    "events.types.feria": "Fair",
    "events.types.mall_event": "Mall Event",
    "events.types.gastronomia": "Gastronomic",
    "events.types.cultural": "Cultural",

    // Plans
    "plans.title": "Local Plans",
    "plans.subtitle": "Discover the best activities and events to enjoy the weekend in Cartagena",
    "plans.updated": "Updated weekly",
    "plans.allNeighborhoods": "All neighborhoods",
    "plans.freeAndPaid": "Free and paid",
    "plans.filters.type": "Plan type",
    "plans.filters.price": "Price",
    "plans.filters.all": "All",
    "plans.types.cultural": "Cultural",
    "plans.types.gastronomic": "Gastronomic",
    "plans.types.outdoor": "Outdoor",
    "plans.types.nightlife": "Nightlife",
    "plans.types.shopping": "Shopping",
    "plans.price.free": "Free",
    "plans.price.paid": "Paid",

    // Mass Schedules
    "mass.title": "Mass Schedules",
    "mass.subtitle": "Updated information on mass schedules at the main parishes in Cartagena",
    "mass.updated": "Updated monthly",
    "mass.mainParishes": "Main parishes",

    // Common
    "common.duration": "Duration",
    "common.difficulty": "Difficulty",
    "common.points": "points of interest",
    "common.start": "Start Route",
    "common.easy": "Easy",
    "common.moderate": "Moderate",
    "common.hard": "Hard",
    "common.minutes": "min",
    "common.hours": "h",
    "cta.viewOnMap": "View on map",
    "cta.contact": "Contact",
    "cta.visit": "Visit",
    "cta.getDirections": "Get directions",
    "cta.viewDetails": "View details",
    "common.clearFilters": "Clear filters",
  },
}

export function getTranslation(locale: Locale, key: string): string {
  // Direct key lookup first (for keys like "nav.history")
  const directValue = translations[locale]?.[key as keyof typeof translations[typeof locale]]
  if (directValue) {
    return directValue
  }

  // Fallback to nested key lookup
  const keys = key.split(".")
  let value: any = translations[locale]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}

export function useTranslation(locale: Locale = defaultLocale) {
  return {
    t: (key: string) => getTranslation(locale, key),
    locale,
  }
}
