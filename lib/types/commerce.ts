export interface Commerce {
  name: string
  slug: string
  type: "mall" | "artisan" | "food" | "shop" | "service" | "culture"
  subtype: string
  barrio: string
  coords: {
    lat: number
    lng: number
  }
  image: string
  tags: string[]
  contact: {
    web?: string
    phone?: string
    whatsapp?: string
    instagram?: string
    email?: string
  }
  hours?: string
  priceHint?: "$" | "$$" | "$$$"
  description: string
  content?: string
}

export interface Event {
  title: string
  slug: string
  startDate: string
  endDate?: string
  type: "festival" | "concierto" | "feria" | "mall_event" | "gastronomia" | "cultural"
  venue: string
  relatedCommerce?: string
  coords: {
    lat: number
    lng: number
  }
  image: string
  tags: string[]
  description: string
  content?: string
}

export interface POI {
  title: string
  slug: string
  category: "historic" | "food" | "culture" | "photo" | "mall" | "commerce"
  coords: {
    lat: number
    lng: number
  }
  image: string
  excerpt: string
  content?: string
  actions?: Array<{
    label: string
    href: string
    type: "link" | "route" | "commerce"
  }>
}

export interface MapLayer {
  id: string
  label: string
  color: string
  icon: string
  active?: boolean
}
