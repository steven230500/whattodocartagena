/**
 * Proyección equirectangular local alrededor de un origen. A escala de barrio
 * (≈3 km) el error es despreciable. Debe coincidir con scripts/city3d/build.mjs.
 */
export interface LatLng {
  lat: number
  lng: number
}

export interface Projection {
  toLocal(p: LatLng): [number, number]
  toLatLng(x: number, y: number): LatLng
}

const KY = 110574

export function createProjection(origin: LatLng): Projection {
  const kx = 111320 * Math.cos((origin.lat * Math.PI) / 180)
  return {
    toLocal: ({ lat, lng }) => [(lng - origin.lng) * kx, (lat - origin.lat) * KY],
    toLatLng: (x, y) => ({ lat: origin.lat + y / KY, lng: origin.lng + x / kx }),
  }
}

/** Local (x este, y norte) → escena three.js (x, altura, z = -norte). */
export const toScene = (x: number, y: number, h = 0): [number, number, number] => [x, h, -y]
