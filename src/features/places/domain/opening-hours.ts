/**
 * Horarios en texto libre (como los escriben los negocios) → abierto / cerrado.
 *
 * Formatos que entiende, combinables con comas o punto y coma:
 *   "12:00 - 23:00"                       todos los días
 *   "18:30 - 23:30 (miércoles a domingo)"  rango de días en palabras
 *   "Lun-Sáb 10:00-21:00, Dom 11:00-20:00" días abreviados, rangos y sueltos
 *   "Dom-Jue 10:00-20:00"                  rangos que dan la vuelta a la semana
 *   "22:00 - 03:00"                        cierre después de medianoche
 *   "24 horas"                             siempre abierto
 * Lo que no entiende devuelve null: mejor "sin dato" que un "abierto" falso.
 */

/** Cartagena está en UTC−5 todo el año. */
const CARTAGENA_OFFSET_MIN = -300

export interface HoursRule {
  /** días en que abre (0 = domingo … 6 = sábado) */
  days: number[]
  /** minutos desde medianoche */
  open: number
  /** puede ser menor que `open` si cierra después de medianoche */
  close: number
}

export type OpenStatus =
  | { open: true; closesAt: number }
  | { open: false; opensAt?: number }

const DAY_INDEX: Record<string, number> = { dom: 0, lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6 }
const DAY_WORD = /\b(dom|lun|mar|mie|jue|vie|sab)[a-z]*\.?/g
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

function dayRange(from: number, to: number): number[] {
  const out: number[] = []
  for (let d = from; ; d = (d + 1) % 7) {
    out.push(d)
    if (d === to) break
  }
  return out
}

/** Días mencionados en un trozo de texto ya normalizado (vacío si no menciona ninguno). */
function parseDays(text: string): number[] {
  const found = [...text.matchAll(DAY_WORD)]
  const days = new Set<number>()
  for (let i = 0; i < found.length; i++) {
    const d = DAY_INDEX[found[i][1]]
    const next = found[i + 1]
    const gap = next ? text.slice(found[i].index! + found[i][0].length, next.index) : ""
    if (next && /^\s*(-|–|a|al)\s*$/.test(gap)) {
      dayRange(d, DAY_INDEX[next[1]]).forEach((x) => days.add(x))
      i++
    } else days.add(d)
  }
  return [...days].sort()
}

const TIME_RANGE = /(\d{1,2})(?:[:.h](\d{2}))?\s*(am|pm)?\s*(?:-|–|a|hasta)\s*(\d{1,2})(?:[:.h](\d{2}))?\s*(am|pm)?/

function toMinutes(h: string, m: string | undefined, ampm: string | undefined): number | null {
  let hour = Number(h)
  const min = m ? Number(m) : 0
  if (ampm === "pm" && hour < 12) hour += 12
  if (ampm === "am" && hour === 12) hour = 0
  if (hour > 24 || min > 59) return null
  return (hour % 24) * 60 + min
}

export function parseHours(text: string | null | undefined): HoursRule[] | null {
  if (!text) return null
  const norm = normalize(text)
  if (/24\s*(h|horas|hrs)|abierto siempre/.test(norm)) return [{ days: ALL_DAYS, open: 0, close: 1440 }]
  const rules: HoursRule[] = []
  for (const segment of norm.split(/[,;\n]/)) {
    const m = segment.match(TIME_RANGE)
    if (!m) continue
    // un rango horario necesita minutos o am/pm en al menos un extremo, si no es ambiguo ("1-2")
    if (!m[2] && !m[5] && !m[3] && !m[6]) continue
    const open = toMinutes(m[1], m[2], m[3])
    const close = toMinutes(m[4], m[5], m[6] ?? m[3])
    if (open === null || close === null || open === close) continue
    const days = parseDays(segment.replace(m[0], " "))
    rules.push({ days: days.length ? days : ALL_DAYS, open, close: close === 0 ? 1440 : close })
  }
  return rules.length ? rules : null
}

/** Día de la semana y minutos en hora de Cartagena. */
export function cartagenaClock(date: Date): { day: number; minutes: number } {
  const local = new Date(date.valueOf() + CARTAGENA_OFFSET_MIN * 60_000)
  return { day: local.getUTCDay(), minutes: local.getUTCHours() * 60 + local.getUTCMinutes() }
}

export function openStatus(rules: HoursRule[] | null, date: Date): OpenStatus | null {
  if (!rules) return null
  const { day, minutes } = cartagenaClock(date)
  const yesterday = (day + 6) % 7
  for (const r of rules) {
    const overnight = r.close < r.open
    if (r.days.includes(day) && minutes >= r.open && (overnight || minutes < r.close)) {
      return { open: true, closesAt: r.close % 1440 }
    }
    // abrió ayer y cierra hoy de madrugada
    if (overnight && r.days.includes(yesterday) && minutes < r.close) return { open: true, closesAt: r.close }
  }
  const later = rules.filter((r) => r.days.includes(day) && r.open > minutes).map((r) => r.open)
  return later.length ? { open: false, opensAt: Math.min(...later) } : { open: false }
}

export const formatClock = (minutes: number) =>
  `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
