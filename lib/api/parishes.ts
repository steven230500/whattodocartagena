import { API_URL } from "./config"
import type { Parish } from "@/lib/types/parish"

interface ApiSchedule {
  day: string
  times: string[]
}

interface ApiParish {
  id: string
  name: string
  address: string
  neighborhood: string
  phone: string | null
  schedules: ApiSchedule[]
}

function toParish(p: ApiParish): Parish {
  return {
    id: p.id,
    name: p.name,
    address: p.address,
    neighborhood: p.neighborhood,
    phone: p.phone ?? undefined,
    schedules: p.schedules.map((s) => ({ day: s.day, times: s.times })),
  }
}

export async function getParishes(): Promise<Parish[]> {
  const res = await fetch(`${API_URL}/api/parishes`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`getParishes: ${res.status}`)
  const data: ApiParish[] = await res.json()
  return data.map(toParish)
}
