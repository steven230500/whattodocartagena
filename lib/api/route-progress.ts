import { API_URL } from "./config"
import { getUserToken } from "./auth"

interface ApiRouteProgress {
  route_id: string
  current_step: number
  updated_at: string
}

// getRouteProgress devuelve el paso guardado, o null sin sesión, sin progreso
// guardado (404 = ruta nunca empezada), o error — nunca tira, para poder
// llamarla siempre desde la página de la ruta sin chequear antes.
export async function getRouteProgress(routeId: string): Promise<number | null> {
  const token = await getUserToken()
  if (!token) return null

  const res = await fetch(`${API_URL}/api/me/route-progress/${routeId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null

  const data: ApiRouteProgress = await res.json()
  return data.current_step
}

export async function putRouteProgress(routeId: string, currentStep: number): Promise<void> {
  const token = await getUserToken()
  if (!token) return

  await fetch(`${API_URL}/api/me/route-progress/${routeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ current_step: currentStep }),
  })
}
