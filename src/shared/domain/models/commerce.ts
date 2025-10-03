export interface Contact {
  web?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  email?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type CommerceType = "mall" | "artisan" | "food" | "shop" | "service" | "culture";

export interface Commerce {
  id: string;
  name: string;
  slug: string;
  type: CommerceType;
  subtype: string;
  neighborhood: string;
  coordinates: Coordinates;
  image: string;
  tags: string[];
  contact: Contact;
  hours?: string;
  priceHint?: "$" | "$$" | "$$$";
  description: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}