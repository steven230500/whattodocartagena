import { describe, expect, it } from "vitest"
import {
  cartagenaDateAt,
  cartagenaMinutes,
  paletteFor,
  sunPosition,
  timePresets,
} from "@/features/city3d/domain/sun"

const CARTAGENA = { lat: 10.4235, lng: -75.546 }
const RAD_TO_DEG = 180 / Math.PI
const DEG_TO_RAD = Math.PI / 180

describe("sun", () => {
  describe("sunPosition", () => {
    it("el 2026-03-20 a las 12:15 hora local (UTC-5) tiene altura > 75° en Cartagena", () => {
      const noon = new Date("2026-03-20T17:15:00Z")
      const pos = sunPosition(noon, CARTAGENA.lat, CARTAGENA.lng)
      expect(pos.altitude * RAD_TO_DEG).toBeGreaterThan(75)
    })

    it("a las 00:00 hora local tiene altura < -60°", () => {
      const midnight = new Date("2026-03-20T05:00:00Z")
      const pos = sunPosition(midnight, CARTAGENA.lat, CARTAGENA.lng)
      expect(pos.altitude * RAD_TO_DEG).toBeLessThan(-60)
    })

    it("en la mañana el azimut está al este (45° a 135°) y en la tarde al oeste (225° a 315°)", () => {
      const morning = new Date("2026-03-20T13:00:00Z") // 08:00 local
      const afternoon = new Date("2026-03-20T21:00:00Z") // 16:00 local

      const morningAz = sunPosition(morning, CARTAGENA.lat, CARTAGENA.lng).azimuth * RAD_TO_DEG
      const afternoonAz = sunPosition(afternoon, CARTAGENA.lat, CARTAGENA.lng).azimuth * RAD_TO_DEG

      expect(morningAz).toBeGreaterThanOrEqual(45)
      expect(morningAz).toBeLessThanOrEqual(135)
      expect(afternoonAz).toBeGreaterThanOrEqual(225)
      expect(afternoonAz).toBeLessThanOrEqual(315)
    })
  })

  describe("cartagenaMinutes", () => {
    it("convierte 17:00 UTC a 720 minutos (mediodía en Cartagena)", () => {
      expect(cartagenaMinutes(new Date("2026-03-20T17:00:00Z"))).toBe(720)
    })

    it("envuelve correctamente alrededor de la medianoche UTC-5", () => {
      expect(cartagenaMinutes(new Date("2026-03-20T05:00:00Z"))).toBe(0)
      expect(cartagenaMinutes(new Date("2026-03-20T04:59:00Z"))).toBe(1439)
    })
  })

  describe("cartagenaDateAt", () => {
    it("minutos 0 devuelve las 05:00 UTC del mismo día de Cartagena", () => {
      const refMidday = new Date("2026-03-20T17:00:00Z") // 12:00 en Cartagena (2026-03-20)
      expect(cartagenaDateAt(0, refMidday).toISOString()).toBe("2026-03-20T05:00:00.000Z")

      // 02:00 UTC del 20 de marzo es 21:00 del 19 de marzo en Cartagena
      const refLateNight = new Date("2026-03-20T02:00:00Z")
      expect(cartagenaDateAt(0, refLateNight).toISOString()).toBe("2026-03-19T05:00:00.000Z")
    })

    it("hace ida y vuelta exacta con cartagenaMinutes", () => {
      const ref = new Date("2026-03-20T15:30:00Z")
      for (const m of [0, 180, 360, 720, 1080, 1439]) {
        expect(cartagenaMinutes(cartagenaDateAt(m, ref))).toBe(m)
      }
    })
  })

  describe("paletteFor", () => {
    const hexRegex = /^#[0-9a-f]{6}$/i

    it("noche plena para -30° tiene night=1", () => {
      const p = paletteFor(-30 * DEG_TO_RAD)
      expect(p.night).toBe(1)
    })

    it("mediodía 60° tiene night=0", () => {
      const p = paletteFor(60 * DEG_TO_RAD)
      expect(p.night).toBe(0)
    })

    it("interpola valores intermedios y produce colores #rrggbb válidos", () => {
      // Entre dos claves, los valores quedan estrictamente entre los de las vecinas
      const before = paletteFor(-1 * DEG_TO_RAD)
      const after = paletteFor(4 * DEG_TO_RAD)
      const p = paletteFor(1.5 * DEG_TO_RAD)
      expect(p.night).toBeLessThan(before.night)
      expect(p.night).toBeGreaterThan(after.night)
      expect(p.sunIntensity).toBeGreaterThan(before.sunIntensity)
      expect(p.sunIntensity).toBeLessThan(after.sunIntensity)

      for (const alt of [-30, -10, -3, 1.5, 9, 30, 60]) {
        const pal = paletteFor(alt * DEG_TO_RAD)
        expect(pal.skyTop).toMatch(hexRegex)
        expect(pal.skyHorizon).toMatch(hexRegex)
        expect(pal.sun).toMatch(hexRegex)
        expect(pal.ambient).toMatch(hexRegex)
        expect(pal.water).toMatch(hexRegex)
      }
    })
  })

  describe("timePresets", () => {
    it("calcula presets ordenados dawn < noon < sunset < night dentro de los rangos esperados", () => {
      const ref = new Date("2026-03-20T17:00:00Z")
      const presets = timePresets(CARTAGENA.lat, CARTAGENA.lng, ref)

      expect(presets.dawn).toBeLessThan(presets.noon)
      expect(presets.noon).toBeLessThan(presets.sunset)
      expect(presets.sunset).toBeLessThan(presets.night)

      expect(presets.dawn).toBeGreaterThanOrEqual(5 * 60)
      expect(presets.dawn).toBeLessThanOrEqual(6 * 60 + 45)

      expect(presets.noon).toBeGreaterThanOrEqual(11 * 60 + 30)
      expect(presets.noon).toBeLessThanOrEqual(12 * 60 + 30)

      expect(presets.sunset).toBeGreaterThanOrEqual(17 * 60)
      expect(presets.sunset).toBeLessThanOrEqual(18 * 60 + 30)
    })
  })
})

describe("momentOf", () => {
  const presets = { dawn: 350, noon: 720, sunset: 1040, night: 1190 }

  it("nombra cada tramo del día", async () => {
    const { momentOf } = await import("@/features/city3d/domain/sun")
    expect(momentOf(120, presets)).toBe("night")
    expect(momentOf(350, presets)).toBe("dawn")
    expect(momentOf(500, presets)).toBe("morning")
    expect(momentOf(720, presets)).toBe("noon")
    expect(momentOf(900, presets)).toBe("afternoon")
    expect(momentOf(1030, presets)).toBe("golden")
    expect(momentOf(1080, presets)).toBe("dusk")
    expect(momentOf(1300, presets)).toBe("night")
  })

  it("acepta minutos fuera de rango", async () => {
    const { momentOf } = await import("@/features/city3d/domain/sun")
    expect(momentOf(720 + 1440, presets)).toBe("noon")
    expect(momentOf(-720, presets)).toBe("noon")
  })
})
