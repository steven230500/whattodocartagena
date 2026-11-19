import type { CityBuilding, Ring } from "./city-model"

function pointInRing(x: number, y: number, ring: Ring) {
  let inside = false
  const n = ring.length / 2
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = ring[i * 2]
    const yi = ring[i * 2 + 1]
    const xj = ring[j * 2]
    const yj = ring[j * 2 + 1]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function centroid(ring: Ring): [number, number] {
  let x = 0
  let y = 0
  const n = ring.length / 2
  for (let i = 0; i < n; i++) {
    x += ring[i * 2]
    y += ring[i * 2 + 1]
  }
  return [x / n, y / n]
}

/**
 * Edificio que contiene el punto (x, y locales). Si el punto cae en la calle,
 * el de centro más cercano dentro de `maxDist` metros. -1 si no hay ninguno.
 */
export function findBuildingAt(buildings: CityBuilding[], x: number, y: number, maxDist = 30): number {
  let best = -1
  let bestD = maxDist * maxDist
  for (let i = 0; i < buildings.length; i++) {
    const ring = buildings[i].rings[0]
    if (pointInRing(x, y, ring)) return i
    const [cx, cy] = centroid(ring)
    const d = (cx - x) ** 2 + (cy - y) ** 2
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return best
}

/**
 * Distancia de cámara para encuadrar un edificio: los chicos se ven de cerca,
 * los enormes (el castillo) desde más lejos. Sin edificio, la distancia base.
 */
export function focusDistance(buildings: CityBuilding[], id: number, base = 210): number {
  const b = buildings[id]
  if (!b) return base
  const ring = b.rings[0]
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (let i = 0; i < ring.length; i += 2) {
    minX = Math.min(minX, ring[i]); maxX = Math.max(maxX, ring[i])
    minY = Math.min(minY, ring[i + 1]); maxY = Math.max(maxY, ring[i + 1])
  }
  const diag = Math.hypot(maxX - minX, maxY - minY)
  return Math.min(Math.max(diag * 2.2, base), 900)
}
