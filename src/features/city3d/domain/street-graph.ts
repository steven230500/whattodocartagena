/**
 * Grafo peatonal de calles (de OSM) y búsqueda A* para trazar rutas por calles reales.
 * Puro: sin three.js ni React.
 */

export interface PathResult {
  /** polilínea [x0,y0,x1,y1,...] en metros locales */
  points: number[]
  /** índice (en puntos) donde cae cada parada dentro de `points` */
  stopIndex: number[]
  /** distancia acumulada en metros por punto */
  distances: number[]
  length: number
}

export class StreetGraph {
  private readonly xs: Float32Array
  private readonly ys: Float32Array
  private readonly offsets: Uint32Array
  private readonly adj: Uint32Array
  private readonly grid = new Map<string, number[]>()
  private static readonly CELL = 40

  constructor(nodes: Float32Array, edges: Uint32Array) {
    const n = nodes.length / 2
    this.xs = new Float32Array(n)
    this.ys = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      this.xs[i] = nodes[i * 2]
      this.ys[i] = nodes[i * 2 + 1]
      const k = this.key(this.xs[i], this.ys[i])
      const cell = this.grid.get(k)
      if (cell) cell.push(i)
      else this.grid.set(k, [i])
    }
    // CSR (no dirigido)
    const deg = new Uint32Array(n)
    for (let e = 0; e < edges.length; e += 2) {
      deg[edges[e]]++
      deg[edges[e + 1]]++
    }
    this.offsets = new Uint32Array(n + 1)
    for (let i = 0; i < n; i++) this.offsets[i + 1] = this.offsets[i] + deg[i]
    this.adj = new Uint32Array(this.offsets[n])
    const fill = this.offsets.slice(0, n)
    for (let e = 0; e < edges.length; e += 2) {
      const a = edges[e]
      const b = edges[e + 1]
      this.adj[fill[a]++] = b
      this.adj[fill[b]++] = a
    }
  }

  private key(x: number, y: number) {
    return `${Math.floor(x / StreetGraph.CELL)}:${Math.floor(y / StreetGraph.CELL)}`
  }

  /** Nodo más cercano dentro de `maxDist` metros, o -1. */
  nearest(x: number, y: number, maxDist = 160): number {
    const r = Math.ceil(maxDist / StreetGraph.CELL)
    const cx = Math.floor(x / StreetGraph.CELL)
    const cy = Math.floor(y / StreetGraph.CELL)
    let best = -1
    let bestD = maxDist * maxDist
    for (let i = -r; i <= r; i++) {
      for (let j = -r; j <= r; j++) {
        const cell = this.grid.get(`${cx + i}:${cy + j}`)
        if (!cell) continue
        for (const k of cell) {
          // solo nodos con aristas
          if (this.offsets[k + 1] === this.offsets[k]) continue
          const d = (this.xs[k] - x) ** 2 + (this.ys[k] - y) ** 2
          if (d < bestD) {
            bestD = d
            best = k
          }
        }
      }
    }
    return best
  }

  /** A* entre dos nodos. Devuelve la lista de nodos o null si no hay camino. */
  shortestPath(from: number, to: number): number[] | null {
    if (from === to) return [from]
    const n = this.xs.length
    const g = new Float64Array(n).fill(Infinity)
    const prev = new Int32Array(n).fill(-1)
    const closed = new Uint8Array(n)
    const heap = new MinHeap()
    const h = (i: number) => Math.hypot(this.xs[i] - this.xs[to], this.ys[i] - this.ys[to])
    g[from] = 0
    heap.push(from, h(from))
    while (heap.size) {
      const cur = heap.pop()
      if (cur === to) break
      if (closed[cur]) continue
      closed[cur] = 1
      for (let e = this.offsets[cur]; e < this.offsets[cur + 1]; e++) {
        const nb = this.adj[e]
        if (closed[nb]) continue
        const cand = g[cur] + Math.hypot(this.xs[nb] - this.xs[cur], this.ys[nb] - this.ys[cur])
        if (cand < g[nb]) {
          g[nb] = cand
          prev[nb] = cur
          heap.push(nb, cand + h(nb))
        }
      }
    }
    if (prev[to] === -1) return null
    const path: number[] = []
    for (let c = to; c !== -1; c = prev[c]) path.push(c)
    return path.reverse()
  }

  /**
   * Traza una ruta que pasa por todas las paradas en orden, siguiendo calles.
   * Si una parada está lejos del grafo o no hay camino, une en línea recta.
   */
  routeThrough(stops: [number, number][]): PathResult {
    const points: number[] = []
    const stopIndex: number[] = []
    const push = (x: number, y: number) => {
      const n = points.length
      if (n >= 2 && Math.abs(points[n - 2] - x) < 0.01 && Math.abs(points[n - 1] - y) < 0.01) return
      points.push(x, y)
    }
    for (let s = 0; s < stops.length; s++) {
      const [x, y] = stops[s]
      if (s > 0) {
        const [px, py] = stops[s - 1]
        const a = this.nearest(px, py)
        const b = this.nearest(x, y)
        const path = a >= 0 && b >= 0 ? this.shortestPath(a, b) : null
        if (path) for (const k of path) push(this.xs[k], this.ys[k])
      }
      push(x, y)
      stopIndex.push(points.length / 2 - 1)
    }
    const distances = [0]
    for (let i = 2; i < points.length; i += 2) {
      distances.push(distances[distances.length - 1] + Math.hypot(points[i] - points[i - 2], points[i + 1] - points[i - 1]))
    }
    return { points, stopIndex, distances, length: distances[distances.length - 1] ?? 0 }
  }
}

/** Punto (y dirección) a una distancia dada sobre la polilínea. */
export function pointAlong(path: PathResult, dist: number): { x: number; y: number; dx: number; dy: number } {
  const { points, distances } = path
  const n = distances.length
  if (n < 2) return { x: points[0] ?? 0, y: points[1] ?? 0, dx: 0, dy: 1 }
  const d = Math.min(Math.max(dist, 0), path.length)
  let lo = 0
  let hi = n - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (distances[m] <= d) lo = m
    else hi = m
  }
  const seg = distances[hi] - distances[lo] || 1
  const t = (d - distances[lo]) / seg
  const ax = points[lo * 2]
  const ay = points[lo * 2 + 1]
  const bx = points[hi * 2]
  const by = points[hi * 2 + 1]
  const len = Math.hypot(bx - ax, by - ay) || 1
  return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, dx: (bx - ax) / len, dy: (by - ay) / len }
}

class MinHeap {
  private ids: number[] = []
  private pr: number[] = []
  get size() {
    return this.ids.length
  }
  push(id: number, p: number) {
    this.ids.push(id)
    this.pr.push(p)
    let i = this.ids.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.pr[parent] <= this.pr[i]) break
      this.swap(i, parent)
      i = parent
    }
  }
  pop(): number {
    const top = this.ids[0]
    const lastId = this.ids.pop()!
    const lastPr = this.pr.pop()!
    if (this.ids.length) {
      this.ids[0] = lastId
      this.pr[0] = lastPr
      let i = 0
      for (;;) {
        const l = i * 2 + 1
        const r = l + 1
        let m = i
        if (l < this.ids.length && this.pr[l] < this.pr[m]) m = l
        if (r < this.ids.length && this.pr[r] < this.pr[m]) m = r
        if (m === i) break
        this.swap(i, m)
        i = m
      }
    }
    return top
  }
  private swap(a: number, b: number) {
    ;[this.ids[a], this.ids[b]] = [this.ids[b], this.ids[a]]
    ;[this.pr[a], this.pr[b]] = [this.pr[b], this.pr[a]]
  }
}
