import { API_URL } from "../config"
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

export async function getAdminPlans(): Promise<Plan[]> {
  const res = await fetch(`${API_URL}/api/plans`, { cache: "no-store" })
  if (!res.ok) throw new Error(`getAdminPlans: ${res.status}`)
  const data: ApiPlan[] = await res.json()
  return data.map(toPlan)
}

export async function getAdminPlanById(id: string): Promise<Plan | null> {
  const all = await getAdminPlans()
  return all.find((p) => p.id === id) ?? null
}
