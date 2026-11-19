import { describe, expect, it } from "vitest"
import { initialState, reducer, stopStatus } from "@/features/city3d/application/explorer-state"

const base = () => initialState({ minutes: 600 })

describe("estado del explorador", () => {
  it("arranca en vivo, en Explorar y sin selección", () => {
    const s = base()
    expect(s.live).toBe(true)
    expect(s.tab).toBe("explore")
    expect(s.selection).toBeNull()
    expect(s.hover).toBe(-1)
  })

  it("con ruta inicial abre la pestaña Rutas y retoma el progreso guardado", () => {
    const s = initialState({ minutes: 600, routeId: "r1", progress: { r1: 2 } })
    expect(s.tab).toBe("routes")
    expect(s.routeId).toBe("r1")
    expect(s.stop).toBe(2)
  })

  it("mover la hora deja de seguir el reloj real y normaliza al día", () => {
    const s = reducer(base(), { type: "time", minutes: 1500 })
    expect(s.live).toBe(false)
    expect(s.minutes).toBe(60)
    expect(reducer(s, { type: "live", minutes: 700 }).live).toBe(true)
  })

  it("elegir el mismo barrio dos veces lo quita del foco", () => {
    const a = reducer(base(), { type: "barrio", index: 3 })
    expect(a.barrio).toBe(3)
    expect(reducer(a, { type: "barrio", index: 3 }).barrio).toBe(-1)
  })

  it("elegir ruta limpia barrio y selección y retoma donde iba", () => {
    let s = initialState({ minutes: 600, progress: { r1: 1 } })
    s = reducer(s, { type: "barrio", index: 2 })
    s = reducer(s, { type: "route", id: "r1" })
    expect(s.barrio).toBe(-1)
    expect(s.selection).toBeNull()
    expect(s.stop).toBe(1)
  })

  it("avanzar de parada registra el progreso máximo alcanzado", () => {
    let s = reducer(base(), { type: "route", id: "r1" })
    s = reducer(s, { type: "stop", index: 2 })
    s = reducer(s, { type: "stop", index: 1 })
    expect(s.stop).toBe(1)
    expect(s.visited.r1).toBe(2)
    expect(s.selection).toEqual({ type: "stop", index: 1 })
  })

  it("sin ruta activa, ni paradas ni recorrido cambian el estado", () => {
    const s = base()
    expect(reducer(s, { type: "stop", index: 3 })).toBe(s)
    expect(reducer(s, { type: "tour", playing: true }).touring).toBe(false)
  })

  it("seleccionar algo que no es parada detiene el recorrido", () => {
    let s = reducer(base(), { type: "route", id: "r1" })
    s = reducer(s, { type: "tour", playing: true })
    expect(s.touring).toBe(true)
    s = reducer(s, { type: "select", selection: { type: "building", id: 5 } })
    expect(s.touring).toBe(false)
  })

  it("hover repetido devuelve el mismo objeto (no re-renderiza)", () => {
    const s = reducer(base(), { type: "hover", id: 4 })
    expect(reducer(s, { type: "hover", id: 4 })).toBe(s)
  })

  it("stopStatus: actual, recorridas y pendientes", () => {
    let s = reducer(initialState({ minutes: 600, progress: { r1: 2 } }), { type: "route", id: "r1" })
    s = reducer(s, { type: "stop", index: 1 })
    expect(stopStatus(s, 1)).toBe("current")
    expect(stopStatus(s, 0)).toBe("done")
    expect(stopStatus(s, 2)).toBe("done")
    expect(stopStatus(s, 3)).toBe("pending")
  })
})
