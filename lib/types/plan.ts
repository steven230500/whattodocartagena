export interface Plan {
  id: string
  title: string
  description: string
  type: "cultural" | "gastronomic" | "outdoor" | "nightlife" | "shopping"
  price: "free" | "paid"
  priceAmount?: string
  date: string
  time: string
  location: string
  neighborhood: string
}
