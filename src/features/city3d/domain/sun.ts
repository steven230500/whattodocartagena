/**
 * Posición del sol (algoritmo de SunCalc / NOAA simplificado) y paleta de luz
 * de la escena según la altura del sol. Puro: sin three.js ni React.
 */

const RAD = Math.PI / 180
const DAY_MS = 86_400_000
const J1970 = 2440588
const J2000 = 2451545
const OBLIQUITY = RAD * 23.4397

/** Cartagena está en UTC−5 todo el año (sin horario de verano). */
export const CARTAGENA_UTC_OFFSET_MIN = -300

export interface SunPosition {
  /** radianes sobre el horizonte */
  altitude: number
  /** radianes desde el norte, sentido horario */
  azimuth: number
}

export function sunPosition(date: Date, lat: number, lng: number): SunPosition {
  const d = date.valueOf() / DAY_MS - 0.5 + J1970 - J2000
  const M = RAD * (357.5291 + 0.98560028 * d)
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M))
  const L = M + C + RAD * 102.9372 + Math.PI
  const dec = Math.asin(Math.sin(OBLIQUITY) * Math.sin(L))
  const ra = Math.atan2(Math.sin(L) * Math.cos(OBLIQUITY), Math.cos(L))
  const H = RAD * (280.16 + 360.9856235 * d) - RAD * -lng - ra
  const phi = RAD * lat
  const altitude = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H))
  const azSouth = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi))
  return { altitude, azimuth: azSouth + Math.PI }
}

/** Minutos del día en hora de Cartagena para un instante dado. */
export function cartagenaMinutes(now: Date): number {
  const m = now.getUTCHours() * 60 + now.getUTCMinutes() + CARTAGENA_UTC_OFFSET_MIN
  return ((m % 1440) + 1440) % 1440
}

/** Instante real correspondiente a "hoy en Cartagena, a los `minutes` del día". */
export function cartagenaDateAt(minutes: number, now = new Date()): Date {
  const local = new Date(now.valueOf() + CARTAGENA_UTC_OFFSET_MIN * 60_000)
  const midnightUtc = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate())
  return new Date(midnightUtc + (minutes - CARTAGENA_UTC_OFFSET_MIN) * 60_000)
}

/** Vector unitario hacia el sol en coordenadas locales (x este, y norte, z arriba). */
export function sunDirection({ altitude, azimuth }: SunPosition): [number, number, number] {
  const c = Math.cos(altitude)
  return [Math.sin(azimuth) * c, Math.cos(azimuth) * c, Math.sin(altitude)]
}

// ------------------------------------------------------------------ paleta

export interface LightPalette {
  skyTop: string
  skyHorizon: string
  sun: string
  sunIntensity: number
  ambient: string
  ambientIntensity: number
  water: string
  /** 0 = día, 1 = noche plena: ventanas, faroles y muralla iluminadas */
  night: number
}

type Key = { alt: number } & LightPalette

// Claves por altura del sol en grados. Interpolación lineal entre vecinas.
const KEYS: Key[] = [
  { alt: -18, skyTop: "#0b1336", skyHorizon: "#2a3a6c", sun: "#b4c4ff", sunIntensity: 1.0, ambient: "#7080c0", ambientIntensity: 1.25, water: "#173866", night: 1 },
  { alt: -6, skyTop: "#1a2860", skyHorizon: "#6e5e92", sun: "#c0b0ff", sunIntensity: 0.9, ambient: "#7a7ab0", ambientIntensity: 1.05, water: "#21406e", night: 0.9 },
  { alt: -1, skyTop: "#2c3f7a", skyHorizon: "#e0788a", sun: "#ff9a70", sunIntensity: 1.0, ambient: "#9a7a92", ambientIntensity: 0.7, water: "#2f4f7a", night: 0.55 },
  { alt: 4, skyTop: "#4566a8", skyHorizon: "#ffa060", sun: "#ff9447", sunIntensity: 2.0, ambient: "#c99a84", ambientIntensity: 0.6, water: "#3f78a8", night: 0.15 },
  { alt: 14, skyTop: "#4f8ad0", skyHorizon: "#ffd9a8", sun: "#ffc98a", sunIntensity: 2.6, ambient: "#dcc8b4", ambientIntensity: 0.7, water: "#3d8fc4", night: 0 },
  { alt: 45, skyTop: "#3a8ee6", skyHorizon: "#cdeaf8", sun: "#fff3df", sunIntensity: 3.0, ambient: "#e6eef6", ambientIntensity: 0.85, water: "#2f9fd6", night: 0 },
  { alt: 90, skyTop: "#2f86e0", skyHorizon: "#c4e6f8", sun: "#fff8ee", sunIntensity: 3.1, ambient: "#eef3f8", ambientIntensity: 0.9, water: "#2aa2d9", night: 0 },
]

const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16))
const toHex = (c: number[]) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
const mixHex = (a: string, b: string, t: number) => {
  const ca = hex(a)
  const cb = hex(b)
  return toHex(ca.map((v, i) => v + (cb[i] - v) * t))
}

export function paletteFor(altitudeRad: number): LightPalette {
  const alt = altitudeRad / RAD
  if (alt <= KEYS[0].alt) return KEYS[0]
  for (let i = 1; i < KEYS.length; i++) {
    const a = KEYS[i - 1]
    const b = KEYS[i]
    if (alt <= b.alt) {
      const t = (alt - a.alt) / (b.alt - a.alt)
      return {
        skyTop: mixHex(a.skyTop, b.skyTop, t),
        skyHorizon: mixHex(a.skyHorizon, b.skyHorizon, t),
        sun: mixHex(a.sun, b.sun, t),
        sunIntensity: a.sunIntensity + (b.sunIntensity - a.sunIntensity) * t,
        ambient: mixHex(a.ambient, b.ambient, t),
        ambientIntensity: a.ambientIntensity + (b.ambientIntensity - a.ambientIntensity) * t,
        water: mixHex(a.water, b.water, t),
        night: a.night + (b.night - a.night) * t,
      }
    }
  }
  return KEYS[KEYS.length - 1]
}

export interface TimePresets {
  dawn: number
  noon: number
  sunset: number
  night: number
}

/**
 * Atajos de la interfaz calculados con el sol real del día (minutos, hora de
 * Cartagena): amanecer y atardecer cuando el sol está a ~3° (hora dorada),
 * mediodía solar y noche cerrada dos horas después de la puesta.
 */
export function timePresets(lat: number, lng: number, now = new Date()): TimePresets {
  const golden = 3 * RAD
  let dawn = 6 * 60
  let sunset = 17 * 60 + 20
  let noon = 12 * 60
  let best = -Infinity
  let prev = -Infinity
  for (let m = 0; m < 1440; m += 2) {
    const alt = sunPosition(cartagenaDateAt(m, now), lat, lng).altitude
    if (prev < golden && alt >= golden) dawn = m
    if (prev >= golden && alt < golden) sunset = m - 2
    if (alt > best) {
      best = alt
      noon = m
    }
    prev = alt
  }
  return { dawn, noon, sunset, night: Math.min(sunset + 150, 1439) }
}

export type DayMoment = "night" | "dawn" | "morning" | "noon" | "afternoon" | "golden" | "dusk"

/** Momento del día con nombre (para la frase que acompaña la hora). */
export function momentOf(minutes: number, p: TimePresets): DayMoment {
  const m = ((minutes % 1440) + 1440) % 1440
  if (m < p.dawn - 60 || m >= p.sunset + 75) return "night"
  if (m < p.dawn + 60) return "dawn"
  if (m < p.noon - 90) return "morning"
  if (m < p.noon + 120) return "noon"
  if (m < p.sunset - 60) return "afternoon"
  if (m < p.sunset + 15) return "golden"
  return "dusk"
}
