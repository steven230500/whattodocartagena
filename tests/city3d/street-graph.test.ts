import { describe, expect, it } from "vitest"
import { pointAlong, StreetGraph } from "@/features/city3d/domain/street-graph"

describe("StreetGraph", () => {
  describe("nearest", () => {
    it("encuentra el nodo más cercano con aristas e ignora nodos aislados", () => {
      // Nodo 0: (0, 0), Nodo 1: (100, 0), Nodo 2: (5, 0) aislado (sin aristas)
      const nodes = new Float32Array([0, 0, 100, 0, 5, 0])
      const edges = new Uint32Array([0, 1])
      const graph = new StreetGraph(nodes, edges)

      expect(graph.nearest(6, 0)).toBe(0)
      expect(graph.nearest(80, 0)).toBe(1)
    })

    it("devuelve -1 si todos los nodos con aristas están más lejos que maxDist", () => {
      const nodes = new Float32Array([0, 0, 50, 0, 5, 0])
      const edges = new Uint32Array([0, 1])
      const graph = new StreetGraph(nodes, edges)

      // Nodo 2 está a distancia 0 de (5, 0), pero no tiene aristas
      expect(graph.nearest(5, 0, 3)).toBe(-1)
      expect(graph.nearest(300, 300, 160)).toBe(-1)
    })
  })

  describe("shortestPath", () => {
    it("elige el atajo más corto frente a un camino en forma de L", () => {
      // 0: (0,0), 1: (100,0), 2: (100,100), 3: (20,50)
      // Camino en L: 0 -> 1 -> 2 (largo 100 + 100 = 200)
      // Atajo: 0 -> 3 -> 2 (largo sqrt(2900) + sqrt(8900) ≈ 53.85 + 94.34 ≈ 148.19)
      const nodes = new Float32Array([0, 0, 100, 0, 100, 100, 20, 50])
      const edges = new Uint32Array([0, 1, 1, 2, 0, 3, 3, 2])
      const graph = new StreetGraph(nodes, edges)

      expect(graph.shortestPath(0, 2)).toEqual([0, 3, 2])
    })

    it("devuelve [n] cuando origen y destino son el mismo nodo", () => {
      const nodes = new Float32Array([0, 0, 10, 0])
      const edges = new Uint32Array([0, 1])
      const graph = new StreetGraph(nodes, edges)

      expect(graph.shortestPath(1, 1)).toEqual([1])
    })

    it("devuelve null cuando no hay conexión entre dos nodos", () => {
      const nodes = new Float32Array([0, 0, 10, 0, 50, 0, 60, 0])
      const edges = new Uint32Array([0, 1, 2, 3])
      const graph = new StreetGraph(nodes, edges)

      expect(graph.shortestPath(0, 3)).toBeNull()
    })
  })

  describe("routeThrough", () => {
    it("genera stopIndex creciente por parada y distances crecientes hasta length", () => {
      const nodes = new Float32Array([0, 0, 50, 0, 100, 0, 100, 50])
      const edges = new Uint32Array([0, 1, 1, 2, 2, 3])
      const graph = new StreetGraph(nodes, edges)

      const route = graph.routeThrough([
        [0, 0],
        [50, 0],
        [100, 50],
      ])

      expect(route.stopIndex).toHaveLength(3)
      expect(route.stopIndex[0]).toBe(0)
      expect(route.stopIndex[0]).toBeLessThan(route.stopIndex[1])
      expect(route.stopIndex[1]).toBeLessThan(route.stopIndex[2])

      expect(route.distances).toHaveLength(route.points.length / 2)
      expect(route.distances[0]).toBe(0)
      for (let i = 1; i < route.distances.length; i++) {
        expect(route.distances[i]).toBeGreaterThan(route.distances[i - 1])
      }
      expect(route.distances[route.distances.length - 1]).toBe(route.length)
      expect(route.length).toBeCloseTo(150, 5)
    })

    it("une en línea recta cuando una parada está lejos del grafo", () => {
      const nodes = new Float32Array([0, 0, 20, 0])
      const edges = new Uint32Array([0, 1])
      const graph = new StreetGraph(nodes, edges)

      const route = graph.routeThrough([
        [0, 0],
        [0, 500],
      ])

      expect(route.stopIndex).toEqual([0, 1])
      expect(route.points).toEqual([0, 0, 0, 500])
      expect(route.length).toBeCloseTo(500, 5)
    })
  })

  describe("pointAlong", () => {
    const path = {
      points: [0, 0, 100, 0, 100, 100],
      stopIndex: [0, 2],
      distances: [0, 100, 200],
      length: 200,
    }

    it("en 0 devuelve el primer punto y en length devuelve el último", () => {
      const start = pointAlong(path, 0)
      expect(start.x).toBe(0)
      expect(start.y).toBe(0)
      expect(start.dx).toBe(1)
      expect(start.dy).toBe(0)

      const end = pointAlong(path, path.length)
      expect(end.x).toBe(100)
      expect(end.y).toBe(100)
      expect(end.dx).toBe(0)
      expect(end.dy).toBe(1)
    })

    it("interpola a la mitad de un segmento recto con dirección unitaria", () => {
      const mid1 = pointAlong(path, 50)
      expect(mid1.x).toBeCloseTo(50, 5)
      expect(mid1.y).toBeCloseTo(0, 5)
      expect(Math.hypot(mid1.dx, mid1.dy)).toBeCloseTo(1, 5)
      expect(mid1.dx).toBeCloseTo(1, 5)
      expect(mid1.dy).toBeCloseTo(0, 5)

      const mid2 = pointAlong(path, 150)
      expect(mid2.x).toBeCloseTo(100, 5)
      expect(mid2.y).toBeCloseTo(50, 5)
      expect(Math.hypot(mid2.dx, mid2.dy)).toBeCloseTo(1, 5)
      expect(mid2.dx).toBeCloseTo(0, 5)
      expect(mid2.dy).toBeCloseTo(1, 5)
    })

    it("acota distancias fuera de rango", () => {
      const before = pointAlong(path, -25)
      expect(before.x).toBe(0)
      expect(before.y).toBe(0)

      const after = pointAlong(path, 999)
      expect(after.x).toBe(100)
      expect(after.y).toBe(100)
    })
  })
})
