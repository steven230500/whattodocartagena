"use server"

import { putRouteProgress } from "@/lib/api/route-progress"

// saveRouteProgress es pasiva: sin sesión no hace nada (putRouteProgress
// resuelve solita), sin redirect ni error — a diferencia de favoritos, acá
// no es una acción explícita del usuario, es solo avanzar en la ruta.
export async function saveRouteProgress(routeId: string, currentStep: number): Promise<void> {
  await putRouteProgress(routeId, currentStep)
}
