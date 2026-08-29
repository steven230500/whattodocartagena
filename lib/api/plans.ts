import { API_URL } from "./config"
import type { Plan } from "@/lib/types/plan"

interface ApiPlan {
  id: string
  title: string
  description: string
  type: string
  price: string
  price_amount: string | null
  date: string
  time: string
  location: string
  neighborhood: string
}

function toPlan(p: ApiPlan): Plan {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    type: p.type as Plan["type"],
    price: p.price as Plan["price"],
    priceAmount: p.price_amount ?? undefined,
    date: p.date,
    time: p.time,
    location: p.location,
    neighborhood: p.neighborhood,
  }
}

export async function getPlans(): Promise<Plan[]> {
  const res = await fetch(`${API_URL}/api/plans`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`getPlans: ${res.status}`)
  const data: ApiPlan[] = await res.json()
  return data.map(toPlan)
}
