/**
 * Modelo de ciudad ya decodificado (metros locales: x = este, y = norte).
 * Lo produce infrastructure/load-city a partir de public/3d/cartagena.json
 * (generado por scripts/city3d/build.mjs).
 */

export type Ring = Float32Array // [x0, y0, x1, y1, ...] en metros

export interface CityBuilding {
  /** anillo exterior (antihorario) + patios (horario) */
  rings: Ring[]
  height: number
  facade: number
  roof: number
  barrio: number
  name?: string
  /** monumento con modelo propio (no se levanta como bloque) */
  landmark?: LandmarkKey
}

export type LandmarkKey = "torre-reloj" | "catedral" | "san-pedro" | "trinidad" | "castillo"

export interface CityBarrio {
  name: string
  ring: Ring
  center: [number, number]
}

export interface CityStreet {
  width: number
  points: Ring
}

export interface CityLandmark {
  name: string
  kind: string
  x: number
  y: number
}

export interface CityModel {
  attribution: string
  origin: { lat: number; lng: number }
  bounds: { minX: number; minY: number; maxX: number; maxY: number }
  barrios: CityBarrio[]
  land: Ring[]
  water: Ring[]
  green: Ring[]
  plazas: Ring[]
  walls: { name?: string; points: Ring }[]
  streets: CityStreet[]
  graph: { nodes: Float32Array; edges: Uint32Array }
  buildings: CityBuilding[]
  landmarks: CityLandmark[]
}

/** Formato crudo del JSON (enteros en decímetros). */
export interface RawCity {
  v: number
  attribution: string
  origin: { lat: number; lng: number }
  scale: number
  bounds: [number, number, number, number]
  barrios: { n: string; p: number[]; c: [number, number] }[]
  land: number[][]
  water: number[][]
  green: number[][]
  plazas: number[][]
  walls: { p: number[]; n?: string }[]
  streets: { w: number; p: number[] }[]
  graph: { n: number[]; e: number[] }
  buildings: { p: number[][]; h: number; f: number; r: number; b: number; n?: string; lm?: LandmarkKey }[]
  landmarks: { n: string; x: number; y: number; k: string }[]
}
