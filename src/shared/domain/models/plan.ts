export type PlanType = "cultural" | "gastronomic" | "outdoor" | "nightlife" | "shopping";

export type PlanPrice = "free" | "paid";

export interface Plan {
  id: string;
  title: string;
  description: string;
  type: PlanType;
  price: PlanPrice;
  priceAmount?: string;
  date: Date;
  time: string;
  location: string;
  neighborhood: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  image?: string;
  tags?: string[];
  capacity?: number;
  organizer?: string;
  createdAt: Date;
  updatedAt: Date;
}