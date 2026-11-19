/**
 * Monumentos modelados a mano (pocos polígonos) sobre su huella real de OSM.
 * OSM no trae alturas ni formas de torres y cúpulas: aquí se arman con
 * primitivas, orientadas según el eje largo de la huella.
 */
import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import type { CityBuilding, CityModel, LandmarkKey, Ring } from "../../domain/city-model"

export interface LandmarkMesh {
  key: LandmarkKey
  buildingId: number
  geometry: THREE.BufferGeometry
  /** centro (x, y locales) y altura máxima, para volar la cámara y anclar etiquetas */
  center: [number, number]
  height: number
}

const C = {
  cream: "#f1e3bf",
  ochre: "#e2b54f",
  ochreDark: "#c9973a",
  white: "#fbf6ea",
  stone: "#d9c49a",
  stoneDark: "#b89f75",
  terracotta: "#c4562f",
  roof: "#a8492b",
  dark: "#4a3326",
  grass: "#8fbf72",
  castle: "#bea57c",
  castleTop: "#cdb68e",
  grey: "#b7b0a4",
}

/** Caja orientada mínima aproximada: eje del lado más largo de la huella. */
function orientedBox(ring: Ring) {
  let best = 0
  let angle = 0
  const n = ring.length / 2
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const dx = ring[j * 2] - ring[i * 2]
    const dy = ring[j * 2 + 1] - ring[i * 2 + 1]
    const len = Math.hypot(dx, dy)
    if (len > best) {
      best = len
      angle = Math.atan2(dy, dx)
    }
  }
  const ux = Math.cos(angle)
  const uy = Math.sin(angle)
  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity
  for (let i = 0; i < n; i++) {
    const x = ring[i * 2]
    const y = ring[i * 2 + 1]
    const u = x * ux + y * uy
    const v = -x * uy + y * ux
    minU = Math.min(minU, u); maxU = Math.max(maxU, u)
    minV = Math.min(minV, v); maxV = Math.max(maxV, v)
  }
  const cu = (minU + maxU) / 2
  const cv = (minV + maxV) / 2
  return {
    angle,
    length: maxU - minU,
    width: maxV - minV,
    cx: cu * ux - cv * uy,
    cy: cu * uy + cv * ux,
  }
}

/**
 * Juego de piezas en el marco del monumento: u = eje largo, v = ancho, h = altura.
 * Al final se rotan/trasladan al lugar real y se fusionan en una geometría.
 */
class Kit {
  private parts: THREE.BufferGeometry[] = []
  constructor(private readonly frame: { angle: number; cx: number; cy: number }) {}

  private add(g: THREE.BufferGeometry, hex: string, u: number, v: number, h: number, rotX = 0, rotZ = 0) {
    const geo = g.index ? g.toNonIndexed() : g
    if (rotX) geo.rotateX(rotX)
    if (rotZ) geo.rotateZ(rotZ)
    // marco local (u, h, v) → escena: u sobre x, v sobre -z antes de rotar
    geo.translate(u, h, -v)
    const color = new THREE.Color(hex)
    const count = geo.getAttribute("position").count
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) colors.set([color.r, color.g, color.b], i * 3)
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geo.deleteAttribute("uv")
    this.parts.push(geo)
  }

  box(hex: string, u: number, v: number, h: number, su: number, sv: number, sh: number) {
    this.add(new THREE.BoxGeometry(su, sh, sv), hex, u, v, h + sh / 2)
  }
  cylinder(hex: string, u: number, v: number, h: number, r: number, sh: number, seg = 16, rTop = r) {
    this.add(new THREE.CylinderGeometry(rTop, r, sh, seg), hex, u, v, h + sh / 2)
  }
  dome(hex: string, u: number, v: number, h: number, r: number) {
    this.add(new THREE.SphereGeometry(r, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2), hex, u, v, h)
  }
  pyramid(hex: string, u: number, v: number, h: number, r: number, sh: number) {
    const g = new THREE.ConeGeometry(r, sh, 4)
    g.rotateY(Math.PI / 4)
    this.add(g, hex, u, v, h + sh / 2)
  }
  /** disco vertical (reloj) mirando hacia ±v */
  disc(hex: string, u: number, v: number, h: number, r: number) {
    this.add(new THREE.CylinderGeometry(r, r, 0.4, 20), hex, u, v, h, Math.PI / 2)
  }
  /** arco: caja oscura con medio cilindro arriba, atravesando en v */
  arch(hex: string, u: number, v: number, h: number, w: number, depth: number, sh: number) {
    this.box(hex, u, v, h, w, depth, sh - w / 2)
    this.add(new THREE.CylinderGeometry(w / 2, w / 2, depth, 12, 1, false, 0, Math.PI), hex, u, v, h + sh - w / 2, Math.PI / 2, Math.PI / 2)
  }
  /** prisma con la forma real de la huella (anillo local en metros) */
  extrude(hex: string, ring: Ring, h0: number, sh: number, topHex = hex, scale = 1, cx = 0, cy = 0) {
    const pts: THREE.Vector2[] = []
    for (let i = 0; i < ring.length; i += 2) {
      pts.push(new THREE.Vector2(cx + (ring[i] - cx) * scale, cy + (ring[i + 1] - cy) * scale))
    }
    const shape = new THREE.Shape(pts)
    const g = new THREE.ExtrudeGeometry(shape, { depth: sh, bevelEnabled: false })
    // ExtrudeGeometry crece en +z: llevarlo a altura y (x, y) local → escena (x, -y)
    g.rotateX(-Math.PI / 2)
    g.translate(0, h0, 0)
    const geo = g.toNonIndexed()
    const pos = geo.getAttribute("position")
    const nor = geo.getAttribute("normal")
    const top = new THREE.Color(topHex)
    const side = new THREE.Color(hex)
    const colors = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) {
      const c = nor.getY(i) > 0.5 ? top : side
      colors.set([c.r, c.g, c.b], i * 3)
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geo.deleteAttribute("uv")
    this.absolute.push(geo)
  }
  /** piezas ya en coordenadas de escena absolutas (no se rotan con el marco) */
  private absolute: THREE.BufferGeometry[] = []

  build(): THREE.BufferGeometry {
    const { angle, cx, cy } = this.frame
    const placed = this.parts.map((g) => {
      g.rotateY(angle)
      g.translate(cx, 0, -cy)
      return g
    })
    const merged = mergeGeometries([...placed, ...this.absolute], false)
    if (!merged) throw new Error("no se pudo fusionar el monumento")
    merged.computeBoundingSphere()
    return merged
  }
}

// ------------------------------------------------------------------ modelos

function torreDelReloj(b: CityBuilding) {
  const ob = orientedBox(b.rings[0])
  const k = new Kit(ob)
  const L = Math.max(ob.length, 14)
  const W = Math.max(Math.min(ob.width, 16), 8)
  // puerta: cuerpo bajo con tres arcos que atraviesan la muralla
  k.box(C.cream, 0, 0, 0, L, W, 11)
  const aw = Math.min(4.2, L / 5)
  for (const u of [-L / 3.2, 0, L / 3.2]) k.arch(C.dark, u, 0, 0, u === 0 ? aw * 1.25 : aw, W + 0.6, u === 0 ? 8.5 : 7)
  k.box(C.white, 0, 0, 11, L + 0.6, W + 0.6, 0.8)
  // torre del reloj
  const T = 7.5
  k.box(C.ochre, 0, 0, 11.8, T, T, 10)
  k.box(C.white, 0, 0, 21.8, T + 0.8, T + 0.8, 0.7)
  for (const s of [1, -1]) {
    k.disc(C.white, 0, s * (T / 2 + 0.1), 17.5, 2)
    k.disc(C.dark, 0, s * (T / 2 + 0.3), 17.5, 0.35)
  }
  // campanario con vanos y cúpula
  k.box(C.white, 0, 0, 22.5, 5.6, 5.6, 4.2)
  k.box(C.dark, 0, 0, 23.3, 5.8, 2.2, 2.6)
  k.box(C.dark, 0, 0, 23.3, 2.2, 5.8, 2.6)
  k.box(C.ochre, 0, 0, 26.7, 6.2, 6.2, 0.6)
  k.dome(C.ochre, 0, 0, 27.3, 2.9)
  k.cylinder(C.dark, 0, 0, 30.1, 0.15, 2.2, 6)
  return { geometry: k.build(), center: [ob.cx, ob.cy] as [number, number], height: 32 }
}

function catedral(b: CityBuilding) {
  const ob = orientedBox(b.rings[0])
  const k = new Kit(ob)
  const L = ob.length
  const W = ob.width
  // nave sobre la huella real
  k.extrude(C.stone, b.rings[0], 0, 17, C.roof)
  // torre en el extremo occidental del eje largo
  const west = Math.cos(ob.angle) > 0 ? -1 : 1
  const tu = west * (L / 2 - 6)
  k.box(C.ochre, tu, 0, 0, 11, 11, 30)
  k.box(C.white, tu, 0, 17, 11.8, 11.8, 0.8)
  k.box(C.white, tu, 0, 30, 12, 12, 0.9)
  k.box(C.dark, tu, 0, 23, 11.4, 3, 4.5)
  k.box(C.dark, tu, 0, 23, 3, 11.4, 4.5)
  k.cylinder(C.ochre, tu, 0, 30.9, 4.6, 5, 8)
  k.box(C.white, tu, 0, 35.9, 10, 10, 0.1)
  k.dome(C.terracotta, tu, 0, 35.9, 4.6)
  k.cylinder(C.ochre, tu, 0, 40.4, 1.1, 2.4, 8)
  k.cylinder(C.dark, tu, 0, 42.8, 0.18, 2.6, 6)
  // contrafuertes laterales
  for (const s of [1, -1]) for (const f of [-0.15, 0.15, 0.35]) k.box(C.stoneDark, f * L, s * (W / 2), 0, 2, 1.6, 15)
  return { geometry: k.build(), center: [ob.cx, ob.cy] as [number, number], height: 45 }
}

function sanPedro(b: CityBuilding) {
  const ob = orientedBox(b.rings[0])
  const k = new Kit(ob)
  const L = ob.length
  const W = ob.width
  k.extrude(C.stone, b.rings[0], 0, 16, C.stoneDark)
  // cúpula de piedra sobre el crucero
  const du = L * 0.18
  k.cylinder(C.stone, du, 0, 16, 6.8, 5.5, 16)
  k.dome(C.grey, du, 0, 21.5, 6.8)
  k.cylinder(C.white, du, 0, 28, 1.2, 2.5, 8)
  k.cylinder(C.dark, du, 0, 30.5, 0.18, 2.2, 6)
  // torre en la esquina de la fachada
  const tu = -L / 2 + 5
  const tv = W / 2 - 4.5
  k.box(C.stone, tu, tv, 0, 8.5, 8.5, 28)
  k.box(C.dark, tu, tv, 21, 8.8, 2.6, 4)
  k.box(C.dark, tu, tv, 21, 2.6, 8.8, 4)
  k.box(C.white, tu, tv, 28, 9.2, 9.2, 0.8)
  k.pyramid(C.terracotta, tu, tv, 28.8, 6, 5)
  return { geometry: k.build(), center: [ob.cx, ob.cy] as [number, number], height: 34 }
}

function trinidad(b: CityBuilding) {
  const ob = orientedBox(b.rings[0])
  const k = new Kit(ob)
  const L = ob.length
  const W = ob.width
  k.extrude(C.cream, b.rings[0], 0, 11, C.roof)
  // espadaña sobre la fachada, con dos vanos de campana
  const fu = -L / 2 + 1
  k.box(C.cream, fu, 0, 11, 1.6, Math.min(W * 0.7, 10), 6)
  for (const s of [-1, 1]) k.box(C.dark, fu, s * Math.min(W * 0.15, 2.2), 13, 1.8, 1.6, 2.4)
  k.pyramid(C.cream, fu, 0, 17, 1.6, 2)
  return { geometry: k.build(), center: [ob.cx, ob.cy] as [number, number], height: 19 }
}

/** Castillo San Felipe: cerro y terrazas escalonadas sobre la huella real. */
function castillo(b: CityBuilding) {
  const ring = b.rings[0]
  let cx = 0
  let cy = 0
  const n = ring.length / 2
  for (let i = 0; i < n; i++) {
    cx += ring[i * 2]
    cy += ring[i * 2 + 1]
  }
  cx /= n
  cy /= n
  const k = new Kit({ angle: 0, cx: 0, cy: 0 })
  k.extrude(C.grass, ring, 0, 5, C.grass, 1.18, cx, cy)
  const tiers = [
    { s: 1, h: 9 },
    { s: 0.8, h: 9 },
    { s: 0.6, h: 8 },
    { s: 0.4, h: 7 },
  ]
  let h = 5
  for (const t of tiers) {
    k.extrude(C.castle, ring, h, t.h, C.castleTop, t.s, cx, cy)
    h += t.h
  }
  return { geometry: k.build(), center: [cx, cy] as [number, number], height: h }
}

const BUILDERS: Record<LandmarkKey, (b: CityBuilding) => Omit<LandmarkMesh, "key" | "buildingId">> = {
  "torre-reloj": torreDelReloj,
  catedral,
  "san-pedro": sanPedro,
  trinidad,
  castillo,
}

export function buildLandmarks(model: CityModel): LandmarkMesh[] {
  const out: LandmarkMesh[] = []
  model.buildings.forEach((b, id) => {
    if (!b.landmark) return
    try {
      out.push({ key: b.landmark, buildingId: id, ...BUILDERS[b.landmark](b) })
    } catch {
      // si un modelo falla, el edificio no se dibuja pero la escena sigue
    }
  })
  return out
}
