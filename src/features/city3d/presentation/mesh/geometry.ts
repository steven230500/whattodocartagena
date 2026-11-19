/**
 * Generadores de geometría a partir del CityModel. Todo se fusiona en pocas
 * mallas (un draw call por capa) para que el celular lo mueva fluido.
 */
import * as THREE from "three"
import type { CityModel, Ring } from "../../domain/city-model"
import { FACADES, ROOFS, SURFACES } from "../palette"

// Alturas de las capas planas (separadas para evitar z-fighting a distancia).
export const LAYER_Y = { water: -1.2, land: 0, inlandWater: 0.25, green: 0.35, plaza: 0.4, street: 0.55 }

const color = (hex: string) => new THREE.Color(hex)
/** Triángulo en orden antihorario visto desde arriba (cara frontal hacia +Y en escena). */
const ccwTri = (pts: THREE.Vector2[], a: number, b: number, c: number) => {
  const area = (pts[b].x - pts[a].x) * (pts[c].y - pts[a].y) - (pts[c].x - pts[a].x) * (pts[b].y - pts[a].y)
  return area >= 0 ? [a, b, c] : [a, c, b]
}

const toV2 = (r: Ring) => {
  const out: THREE.Vector2[] = []
  for (let i = 0; i < r.length; i += 2) out.push(new THREE.Vector2(r[i], r[i + 1]))
  return out
}

/** Crea un Float32Array creciente sin realocar en cada push. */
class Buf {
  data: Float32Array
  n = 0
  constructor(size = 1024) {
    this.data = new Float32Array(size)
  }
  push(...v: number[]) {
    if (this.n + v.length > this.data.length) {
      const next = new Float32Array(Math.max(this.data.length * 2, this.n + v.length))
      next.set(this.data)
      this.data = next
    }
    for (const x of v) this.data[this.n++] = x
  }
  get array() {
    return this.data.subarray(0, this.n)
  }
}

// ------------------------------------------------------------------ edificios

export interface BuildingsGeometry {
  geometry: THREE.BufferGeometry
  /** centro (x, y) y altura por edificio, para volar la cámara y poner etiquetas */
  centers: Float32Array
}

export function buildBuildings(model: CityModel): BuildingsGeometry {
  const pos = new Buf(1 << 20)
  const nor = new Buf(1 << 20)
  const col = new Buf(1 << 20)
  const ids = new Buf(1 << 18)
  const barrios = new Buf(1 << 18)
  const centers = new Float32Array(model.buildings.length * 3)
  const facades = FACADES.map(color)
  const roofs = ROOFS.map(color)
  const c = new THREE.Color()

  model.buildings.forEach((b, id) => {
    const h = b.height
    const outer = toV2(b.rings[0])
    const holes = b.rings.slice(1).map(toV2)
    const jitter = 0.92 + ((id * 2654435761) % 1000) / 1000 * 0.16
    const fc = facades[b.facade] ?? facades[8]
    // azoteas del centro histórico: toman un poco del color de la fachada
    const rc = b.roof === 2 && b.facade < 8 ? roofs[2].clone().lerp(fc, 0.35) : roofs[b.roof] ?? roofs[2]

    let cx = 0
    let cy = 0
    for (const p of outer) {
      cx += p.x
      cy += p.y
    }
    centers[id * 3] = cx / outer.length
    centers[id * 3 + 1] = cy / outer.length
    centers[id * 3 + 2] = h
    // los monumentos tienen modelo propio (mesh/landmarks.ts)
    if (b.landmark) return

    const vert = (x: number, y: number, z: number, nx: number, ny: number, nz: number, r: number, g: number, bl: number) => {
      pos.push(x, y, z)
      nor.push(nx, ny, nz)
      col.push(r, g, bl)
      ids.push(id)
      barrios.push(b.barrio)
    }

    // fachadas (anillo exterior antihorario y patios horarios → normal hacia fuera del sólido)
    for (const ring of [outer, ...holes]) {
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i]
        const d = ring[(i + 1) % ring.length]
        const ex = d.x - a.x
        const ey = d.y - a.y
        const len = Math.hypot(ex, ey) || 1
        // normal local (x este, y norte) = (ey, -ex) → escena (x, 0, -y)
        const nx = ey / len
        const nz = ex / len
        c.copy(fc).multiplyScalar(jitter)
        const top = [c.r, c.g, c.b] as const
        c.multiplyScalar(0.7) // oclusión falsa al pie del muro
        const bot = [c.r, c.g, c.b] as const
        vert(a.x, 0, -a.y, nx, 0, nz, ...bot)
        vert(d.x, 0, -d.y, nx, 0, nz, ...bot)
        vert(d.x, h, -d.y, nx, 0, nz, ...top)
        vert(a.x, 0, -a.y, nx, 0, nz, ...bot)
        vert(d.x, h, -d.y, nx, 0, nz, ...top)
        vert(a.x, h, -a.y, nx, 0, nz, ...top)
      }
    }

    // techo
    let tris: number[][] = []
    try {
      tris = THREE.ShapeUtils.triangulateShape(outer, holes)
    } catch {
      tris = []
    }
    const all = [...outer, ...holes.flat()]
    c.copy(rc).multiplyScalar(jitter)
    for (const [i0, i1, i2] of tris) {
      for (const k of ccwTri(all, i0, i1, i2)) {
        const p = all[k]
        vert(p.x, h, -p.y, 0, 1, 0, c.r, c.g, c.b)
      }
    }
  })

  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.BufferAttribute(pos.array.slice(), 3))
  g.setAttribute("normal", new THREE.BufferAttribute(nor.array.slice(), 3))
  g.setAttribute("color", new THREE.BufferAttribute(col.array.slice(), 3))
  g.setAttribute("aId", new THREE.BufferAttribute(ids.array.slice(), 1))
  g.setAttribute("aBarrio", new THREE.BufferAttribute(barrios.array.slice(), 1))
  g.computeBoundingSphere()
  g.computeBoundingBox()
  return { geometry: g, centers }
}

// ------------------------------------------------------------------ superficies planas

/** Polígonos planos a una altura, con faldón opcional (borde costero). */
export function buildFlat(rings: Ring[], y: number, hex: string, skirt?: { depth: number; hex: string }) {
  const pos = new Buf()
  const nor = new Buf()
  const col = new Buf()
  const top = color(hex)
  const side = skirt ? color(skirt.hex) : top
  for (const r of rings) {
    const pts = toV2(r)
    if (pts.length < 3) continue
    let tris: number[][] = []
    try {
      tris = THREE.ShapeUtils.triangulateShape(pts, [])
    } catch {
      continue
    }
    for (const [a, b, c] of tris) {
      for (const k of ccwTri(pts, a, b, c)) {
        pos.push(pts[k].x, y, -pts[k].y)
        nor.push(0, 1, 0)
        col.push(top.r, top.g, top.b)
      }
    }
    if (skirt) {
      const ccw = THREE.ShapeUtils.isClockWise(pts) ? [...pts].reverse() : pts
      for (let i = 0; i < ccw.length; i++) {
        const a = ccw[i]
        const d = ccw[(i + 1) % ccw.length]
        const len = Math.hypot(d.x - a.x, d.y - a.y) || 1
        const nx = (d.y - a.y) / len
        const nz = (d.x - a.x) / len
        const y0 = y - skirt.depth
        const quad = [
          [a.x, y0, a.y], [d.x, y0, d.y], [d.x, y, d.y],
          [a.x, y0, a.y], [d.x, y, d.y], [a.x, y, a.y],
        ]
        for (const [qx, qy, qz] of quad) {
          pos.push(qx, qy, -qz)
          nor.push(nx, 0, nz)
          col.push(side.r, side.g, side.b)
        }
      }
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.BufferAttribute(pos.array.slice(), 3))
  g.setAttribute("normal", new THREE.BufferAttribute(nor.array.slice(), 3))
  g.setAttribute("color", new THREE.BufferAttribute(col.array.slice(), 3))
  return g
}

// ------------------------------------------------------------------ cintas (calles, ruta)

/** Offsets laterales con inglete limitado para una polilínea. */
function miterOffsets(pts: Ring) {
  const n = pts.length / 2
  const out = new Float32Array(n * 2)
  for (let i = 0; i < n; i++) {
    const px = pts[Math.max(i - 1, 0) * 2]
    const py = pts[Math.max(i - 1, 0) * 2 + 1]
    const nx_ = pts[Math.min(i + 1, n - 1) * 2]
    const ny_ = pts[Math.min(i + 1, n - 1) * 2 + 1]
    const x = pts[i * 2]
    const y = pts[i * 2 + 1]
    let d1x = x - px
    let d1y = y - py
    let d2x = nx_ - x
    let d2y = ny_ - y
    const l1 = Math.hypot(d1x, d1y)
    const l2 = Math.hypot(d2x, d2y)
    if (l1 > 0) {
      d1x /= l1
      d1y /= l1
    }
    if (l2 > 0) {
      d2x /= l2
      d2y /= l2
    }
    let tx = d1x + d2x
    let ty = d1y + d2y
    const tl = Math.hypot(tx, ty)
    if (tl < 1e-6) {
      tx = l2 > 0 ? d2x : d1x
      ty = l2 > 0 ? d2y : d1y
    } else {
      tx /= tl
      ty /= tl
    }
    // normal izquierda de la tangente
    const ox = -ty
    const oy = tx
    const ref = l2 > 0 ? [-d2y, d2x] : [-d1y, d1x]
    const dot = ox * ref[0] + oy * ref[1]
    const scale = Math.min(1 / Math.max(dot, 0.35), 2.5)
    out[i * 2] = ox * scale
    out[i * 2 + 1] = oy * scale
  }
  return out
}

export function buildStreets(model: CityModel) {
  const pos = new Buf(1 << 18)
  const col = new Buf(1 << 18)
  const major = color(SURFACES.streetMajor)
  const minor = color(SURFACES.street)
  const foot = color(SURFACES.footway)
  for (const s of model.streets) {
    const pts = s.points
    const n = pts.length / 2
    if (n < 2) continue
    const off = miterOffsets(pts)
    const hw = s.width / 2
    const c = s.width >= 10 ? major : s.width >= 4.5 ? minor : foot
    const y = LAYER_Y.street + (s.width >= 10 ? 0.05 : 0)
    for (let i = 0; i < n - 1; i++) {
      const ax = pts[i * 2], ay = pts[i * 2 + 1]
      const bx = pts[i * 2 + 2], by = pts[i * 2 + 3]
      const aLx = ax + off[i * 2] * hw, aLy = ay + off[i * 2 + 1] * hw
      const aRx = ax - off[i * 2] * hw, aRy = ay - off[i * 2 + 1] * hw
      const bLx = bx + off[i * 2 + 2] * hw, bLy = by + off[i * 2 + 3] * hw
      const bRx = bx - off[i * 2 + 2] * hw, bRy = by - off[i * 2 + 3] * hw
      pos.push(aRx, y, -aRy, bRx, y, -bRy, bLx, y, -bLy, aRx, y, -aRy, bLx, y, -bLy, aLx, y, -aLy)
      for (let k = 0; k < 6; k++) col.push(c.r, c.g, c.b)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.BufferAttribute(pos.array.slice(), 3))
  g.setAttribute("color", new THREE.BufferAttribute(col.array.slice(), 3))
  const normals = new Float32Array(pos.n)
  for (let i = 1; i < normals.length; i += 3) normals[i] = 1
  g.setAttribute("normal", new THREE.BufferAttribute(normals, 3))
  return g
}

// ------------------------------------------------------------------ muralla

export const WALL = { width: 14, height: 10, merlonEvery: 3.6 }

export interface WallsGeometry {
  body: THREE.BufferGeometry
  /** matrices de las almenas (InstancedMesh) */
  merlons: THREE.Matrix4[]
}

export function buildWalls(model: CityModel): WallsGeometry {
  const pos = new Buf()
  const nor = new Buf()
  const col = new Buf()
  const top = color(SURFACES.wallTop)
  const side = color(SURFACES.wall)
  const merlons: THREE.Matrix4[] = []
  const { width, height, merlonEvery } = WALL
  const hw = width / 2
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)

  const quad = (
    a: number[], b: number[], c: number[], d: number[], n: number[], cl: THREE.Color,
  ) => {
    for (const p of [a, b, c, a, c, d]) {
      pos.push(p[0], p[1], p[2])
      nor.push(n[0], n[1], n[2])
      col.push(cl.r, cl.g, cl.b)
    }
  }

  for (const w of model.walls) {
    const pts = w.points
    const n = pts.length / 2
    if (n < 2) continue
    const off = miterOffsets(pts)
    let carry = merlonEvery / 2
    for (let i = 0; i < n - 1; i++) {
      const ax = pts[i * 2], ay = pts[i * 2 + 1]
      const bx = pts[i * 2 + 2], by = pts[i * 2 + 3]
      const L = (k: number, s: number) => [pts[k * 2] + off[k * 2] * hw * s, pts[k * 2 + 1] + off[k * 2 + 1] * hw * s]
      const [aLx, aLy] = L(i, 1)
      const [aRx, aRy] = L(i, -1)
      const [bLx, bLy] = L(i + 1, 1)
      const [bRx, bRy] = L(i + 1, -1)
      const sc = (x: number, y: number, h: number) => [x, h, -y]
      const len = Math.hypot(bx - ax, by - ay) || 1
      const dx = (bx - ax) / len
      const dy = (by - ay) / len
      // tapa superior
      quad(sc(aRx, aRy, height), sc(bRx, bRy, height), sc(bLx, bLy, height), sc(aLx, aLy, height), [0, 1, 0], top)
      // costados (talud leve: la base es un poco más ancha)
      const flare = 1.15
      const [aLbx, aLby] = [ax + (aLx - ax) * flare, ay + (aLy - ay) * flare]
      const [bLbx, bLby] = [bx + (bLx - bx) * flare, by + (bLy - by) * flare]
      const [aRbx, aRby] = [ax + (aRx - ax) * flare, ay + (aRy - ay) * flare]
      const [bRbx, bRby] = [bx + (bRx - bx) * flare, by + (bRy - by) * flare]
      quad(sc(aLbx, aLby, 0), sc(aLx, aLy, height), sc(bLx, bLy, height), sc(bLbx, bLby, 0), [-dy, 0.15, -dx], side)
      quad(sc(aRbx, aRby, 0), sc(bRbx, bRby, 0), sc(bRx, bRy, height), sc(aRx, aRy, height), [dy, 0.15, dx], side)

      // almenas a ambos bordes
      q.setFromAxisAngle(up, Math.atan2(dy, dx))
      for (let t = carry; t < len; t += merlonEvery) {
        const px = ax + dx * t
        const py = ay + dy * t
        for (const s of [1, -1]) {
          const ox = -dy * (hw - 0.5) * s
          const oy = dx * (hw - 0.5) * s
          m.compose(new THREE.Vector3(px + ox, height + 0.65, -(py + oy)), q, new THREE.Vector3(1.7, 1.3, 1))
          merlons.push(m.clone())
        }
      }
      carry = merlonEvery - ((len - carry) % merlonEvery)
    }
  }
  const body = new THREE.BufferGeometry()
  body.setAttribute("position", new THREE.BufferAttribute(pos.array.slice(), 3))
  body.setAttribute("normal", new THREE.BufferAttribute(nor.array.slice(), 3))
  body.setAttribute("color", new THREE.BufferAttribute(col.array.slice(), 3))
  return { body, merlons }
}
