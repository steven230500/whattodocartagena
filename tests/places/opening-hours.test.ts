import { describe, expect, it } from "vitest"
import { cartagenaClock, formatClock, openStatus, parseHours } from "@/features/places/domain/opening-hours"

/** Instante con hora local de Cartagena (UTC−5). 2026-11-16 es lunes. */
const at = (isoLocal: string) => new Date(`${isoLocal}-05:00`)
const MON = "2026-11-16"
const SAT = "2026-11-21"
const SUN = "2026-11-22"
const TUE = "2026-11-17"

describe("parseHours", () => {
  it("rango simple vale para todos los días", () => {
    expect(parseHours("12:00 - 23:00")).toEqual([{ days: [0, 1, 2, 3, 4, 5, 6], open: 720, close: 1380 }])
  })

  it("días en palabras entre paréntesis", () => {
    expect(parseHours("18:30 - 23:30 (miércoles a domingo)")).toEqual([{ days: [0, 3, 4, 5, 6], open: 1110, close: 1410 }])
  })

  it("varios tramos con días abreviados y tildes", () => {
    expect(parseHours("Lun-Sáb 10:00-21:00, Dom 11:00-20:00")).toEqual([
      { days: [1, 2, 3, 4, 5, 6], open: 600, close: 1260 },
      { days: [0], open: 660, close: 1200 },
    ])
  })

  it("rangos de días que dan la vuelta a la semana", () => {
    expect(parseHours("Dom-Jue 10:00-20:00, Vie-Sáb 10:00-21:00")?.[0].days).toEqual([0, 1, 2, 3, 4])
  })

  it("am/pm y 24 horas", () => {
    expect(parseHours("9am - 6pm")).toEqual([{ days: [0, 1, 2, 3, 4, 5, 6], open: 540, close: 1080 }])
    expect(parseHours("Abierto 24 horas")).toEqual([{ days: [0, 1, 2, 3, 4, 5, 6], open: 0, close: 1440 }])
  })

  it("lo que no entiende devuelve null", () => {
    expect(parseHours("")).toBeNull()
    expect(parseHours(null)).toBeNull()
    expect(parseHours("Consultar por WhatsApp")).toBeNull()
    expect(parseHours("1-2")).toBeNull()
  })
})

describe("openStatus", () => {
  it("abierto dentro del horario, con hora de cierre", () => {
    expect(openStatus(parseHours("12:00 - 23:00"), at(`${MON}T13:00`))).toEqual({ open: true, closesAt: 1380 })
  })

  it("cerrado antes de abrir avisa a qué hora abre", () => {
    expect(openStatus(parseHours("12:00 - 23:00"), at(`${MON}T09:15`))).toEqual({ open: false, opensAt: 720 })
  })

  it("cerrado después de cerrar, sin hora de apertura ese día", () => {
    expect(openStatus(parseHours("12:00 - 23:00"), at(`${MON}T23:30`))).toEqual({ open: false })
  })

  it("respeta los días: cerrado un martes si abre de miércoles a domingo", () => {
    const rules = parseHours("18:30 - 23:30 (miércoles a domingo)")
    expect(openStatus(rules, at(`${TUE}T19:00`))).toEqual({ open: false })
    expect(openStatus(rules, at(`${SUN}T19:00`))).toEqual({ open: true, closesAt: 1410 })
  })

  it("usa el tramo del día que corresponde", () => {
    const rules = parseHours("Lun-Sáb 10:00-21:00, Dom 11:00-20:00")
    expect(openStatus(rules, at(`${SAT}T20:30`))).toEqual({ open: true, closesAt: 1260 })
    expect(openStatus(rules, at(`${SUN}T20:30`))).toEqual({ open: false })
    expect(openStatus(rules, at(`${SUN}T10:30`))).toEqual({ open: false, opensAt: 660 })
  })

  it("horario que cruza la medianoche", () => {
    const rules = parseHours("Vie-Sáb 22:00 - 03:00")
    expect(openStatus(rules, at(`${SAT}T23:00`))).toEqual({ open: true, closesAt: 180 })
    // domingo 01:00: sigue abierto desde el sábado
    expect(openStatus(rules, at(`${SUN}T01:00`))).toEqual({ open: true, closesAt: 180 })
    expect(openStatus(rules, at(`${SUN}T04:00`))).toEqual({ open: false })
  })

  it("sin horario no hay estado", () => {
    expect(openStatus(null, new Date())).toBeNull()
  })
})

describe("reloj de Cartagena", () => {
  it("convierte UTC a hora local (UTC−5)", () => {
    expect(cartagenaClock(new Date("2026-11-17T03:30:00Z"))).toEqual({ day: 1, minutes: 22 * 60 + 30 })
  })

  it("formatea minutos como HH:MM", () => {
    expect(formatClock(1410)).toBe("23:30")
    expect(formatClock(180)).toBe("03:00")
    expect(formatClock(1440)).toBe("00:00")
  })
})
