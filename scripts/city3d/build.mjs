#!/usr/bin/env node
/**
 * Pipeline offline: OpenStreetMap → public/3d/cartagena.json
 *
 *   node scripts/city3d/build.mjs           # usa la caché local de OSM si existe
 *   node scripts/city3d/build.mjs --fetch   # vuelve a bajar los datos de OSM
 *
 * El JSON resultante se commitea: el build de la app nunca depende de la red.
 * Datos © OpenStreetMap contributors (ODbL) — la escena debe mostrar la atribución.
 *
 * Coordenadas de salida: metros locales (x = este, y = norte) respecto a ORIGIN,
 * cuantizados a decímetros (enteros) para que el archivo pese poco.
 * La misma proyección vive en src/features/city3d/domain/projection.ts — si cambias
 * ORIGIN aquí, cámbialo allá (el JSON lo incluye y el cliente lo lee de ahí).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CACHE = path.join(HERE, ".cache")
const OUT = path.join(HERE, "../../public/3d/cartagena.json")

// Centro histórico + Getsemaní + San Diego + La Matuna + Manga norte + San Felipe
const BBOX = { minLat: 10.413, maxLat: 10.434, minLng: -75.56, maxLng: -75.532 }
const ORIGIN = { lat: 10.4235, lng: -75.546 }
const KX = 111320 * Math.cos((ORIGIN.lat * Math.PI) / 180)
const KY = 110574

const project = (lat, lng) => [(lng - ORIGIN.lng) * KX, (lat - ORIGIN.lat) * KY]
const [minX, minY] = project(BBOX.minLat, BBOX.minLng)
const [maxX, maxY] = project(BBOX.maxLat, BBOX.maxLng)
const q = (v) => Math.round(v * 10) // decímetros

// ---------------------------------------------------------------- fetch / load
async function fetchTiles() {
  fs.mkdirSync(CACHE, { recursive: true })
  const N = 3
  const dLat = (BBOX.maxLat - BBOX.minLat) / N
  const dLng = (BBOX.maxLng - BBOX.minLng) / N
  let i = 0
  for (let a = 0; a < N; a++) {
    for (let b = 0; b < N; b++) {
      i++
      const s = BBOX.minLat + a * dLat
      const w = BBOX.minLng + b * dLng
      const url = `https://api.openstreetmap.org/api/0.6/map.json?bbox=${w},${s},${w + dLng},${s + dLat}`
      const res = await fetch(url, { headers: { "User-Agent": "city3d-build-script" } })
      if (!res.ok) throw new Error(`OSM ${res.status} en tile ${i}`)
      fs.writeFileSync(path.join(CACHE, `tile${i}.json`), await res.text())
      console.log(`tile ${i}/${N * N} ok`)
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
}

function loadOsm() {
  const nodes = new Map()
  const ways = new Map()
  const rels = new Map()
  for (const f of fs.readdirSync(CACHE).filter((f) => /^tile\d+\.json$/.test(f))) {
    const d = JSON.parse(fs.readFileSync(path.join(CACHE, f), "utf8"))
    for (const e of d.elements) {
      if (e.type === "node") nodes.set(e.id, e)
      else if (e.type === "way") ways.set(e.id, e)
      else rels.set(e.id, e)
    }
  }
  return { nodes, ways, rels }
}

// ---------------------------------------------------------------- geometría
const inside = ([x, y]) => x >= minX && x <= maxX && y >= minY && y <= maxY

function signedArea(ring) {
  let a = 0
  for (let i = 0, n = ring.length; i < n; i++) {
    const [x1, y1] = ring[i]
    const [x2, y2] = ring[(i + 1) % n]
    a += x1 * y2 - x2 * y1
  }
  return a / 2
}

function centroid(ring) {
  let x = 0
  let y = 0
  for (const p of ring) {
    x += p[0]
    y += p[1]
  }
  return [x / ring.length, y / ring.length]
}

function pointInRing([x, y], ring) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/** Sutherland–Hodgman contra el bbox (ventana convexa). */
function clipRing(ring) {
  const edges = [
    (p) => p[0] >= minX, (p) => p[0] <= maxX, (p) => p[1] >= minY, (p) => p[1] <= maxY,
  ]
  const cut = [
    (a, b) => lerpAt(a, b, 0, minX), (a, b) => lerpAt(a, b, 0, maxX),
    (a, b) => lerpAt(a, b, 1, minY), (a, b) => lerpAt(a, b, 1, maxY),
  ]
  let out = ring
  for (let e = 0; e < 4; e++) {
    const input = out
    out = []
    for (let i = 0; i < input.length; i++) {
      const cur = input[i]
      const prev = input[(i + input.length - 1) % input.length]
      const ci = edges[e](cur)
      const pi = edges[e](prev)
      if (ci) {
        if (!pi) out.push(cut[e](prev, cur))
        out.push(cur)
      } else if (pi) out.push(cut[e](prev, cur))
    }
    if (out.length < 3) return null
  }
  return out
}

function lerpAt(a, b, axis, v) {
  const t = (v - a[axis]) / (b[axis] - a[axis])
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

/** Quita vértices casi colineales / duplicados (Douglas-Peucker simplificado por distancia). */
function simplify(ring, tol = 0.25) {
  const out = []
  for (const p of ring) {
    const last = out[out.length - 1]
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > tol) out.push(p)
  }
  if (out.length > 1) {
    const a = out[0]
    const b = out[out.length - 1]
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) <= tol) out.pop()
  }
  return out
}

/** Une ways (listas de ids de nodo) en anillos cerrados. Devuelve [anillos, abiertos]. */
function assembleRings(wayNodeLists) {
  const pending = wayNodeLists.map((l) => [...l])
  const rings = []
  const open = []
  while (pending.length) {
    let cur = pending.shift()
    let grew = true
    while (cur[0] !== cur[cur.length - 1] && grew) {
      grew = false
      for (let i = 0; i < pending.length; i++) {
        const w = pending[i]
        const end = cur[cur.length - 1]
        if (w[0] === end) cur = cur.concat(w.slice(1))
        else if (w[w.length - 1] === end) cur = cur.concat([...w].reverse().slice(1))
        else continue
        pending.splice(i, 1)
        grew = true
        break
      }
    }
    if (cur[0] === cur[cur.length - 1]) rings.push(cur.slice(0, -1))
    else open.push(cur)
  }
  return [rings, open]
}

// ---------------------------------------------------------------- costa → tierra
/**
 * La costa en OSM son líneas con la tierra a la izquierda. Se recortan contra el bbox
 * y se cierran caminando el borde en sentido antihorario.
 */
function buildLand(coastChains) {
  const per = 2 * (maxX - minX) + 2 * (maxY - minY)
  const tOf = ([x, y]) => {
    const e = 1e-6
    if (Math.abs(y - minY) < e) return x - minX
    if (Math.abs(x - maxX) < e) return maxX - minX + (y - minY)
    if (Math.abs(y - maxY) < e) return 2 * (maxX - minX) + (maxY - minY) - (x - minX)
    return per - (y - minY)
  }
  const corners = [
    [maxX, minY, maxX - minX],
    [maxX, maxY, 2 * (maxX - minX) - (maxX - minX) + (maxY - minY)],
    [minX, maxY, 2 * (maxX - minX) + (maxY - minY)],
    [minX, minY, per],
  ]
  corners[1][2] = maxX - minX + (maxY - minY)

  const pieces = [] // {pts, tIn, tOut}
  const islands = []
  for (const chain of coastChains) {
    const closed =
      chain.length > 2 &&
      chain[0][0] === chain[chain.length - 1][0] &&
      chain[0][1] === chain[chain.length - 1][1]
    if (closed && chain.every(inside)) {
      islands.push(chain.slice(0, -1))
      continue
    }
    let cur = inside(chain[0]) ? [chain[0]] : null
    const starts = []
    for (let i = 1; i < chain.length; i++) {
      const a = chain[i - 1]
      const b = chain[i]
      const ia = inside(a)
      const ib = inside(b)
      if (ia && ib) cur.push(b)
      else if (ia && !ib) {
        cur.push(segBoxHit(a, b, true))
        pieces.push(cur)
        cur = null
      } else if (!ia && ib) {
        cur = [segBoxHit(a, b, false), b]
      } else {
        const hits = segBoxCross(a, b)
        if (hits) pieces.push(hits)
      }
    }
    if (cur && cur.length > 1) {
      // Cadena que empieza dentro (cerrada que cruza el borde): se une al primer trozo.
      if (closed && pieces.length && inside(chain[0])) starts.push(cur)
      else pieces.push(cur)
    }
    for (const s of starts) {
      const first = pieces.find((p) => p[0][0] === s[s.length - 1][0] && p[0][1] === s[s.length - 1][1])
      if (first) first.unshift(...s.slice(0, -1))
    }
  }

  const segs = pieces
    .filter((p) => p.length >= 2)
    .map((pts) => ({ pts, tIn: tOf(pts[0]), tOut: tOf(pts[pts.length - 1]), used: false }))
  const rings = []
  for (const s0 of segs) {
    if (s0.used) continue
    const ring = []
    let s = s0
    while (s && !s.used) {
      s.used = true
      ring.push(...s.pts)
      // siguiente entrada en sentido antihorario desde tOut
      let best = null
      let bestD = Infinity
      for (const c of segs) {
        const d = (c.tIn - s.tOut + per) % per
        if ((!c.used || c === s0) && d < bestD) {
          bestD = d
          best = c
        }
      }
      if (!best) break
      for (const [cx, cy, ct] of corners) {
        const d = (ct - s.tOut + per) % per
        if (d > 0 && d < bestD) ring.push([cx, cy, d])
      }
      // ordenar las esquinas insertadas por distancia
      const tail = []
      while (ring.length && ring[ring.length - 1].length === 3) tail.unshift(ring.pop())
      tail.sort((a, b) => a[2] - b[2]).forEach((c) => ring.push([c[0], c[1]]))
      s = best === s0 ? null : best
    }
    if (ring.length >= 3) rings.push(ring)
  }
  if (!segs.length) {
    // sin costa cruzando: todo tierra salvo islas de agua — no aplica aquí
    rings.push([[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]])
  }
  return [...rings, ...islands]
}

function segBoxHit(a, b) {
  // punto donde el segmento a→b cruza el borde del bbox (uno dentro, otro fuera)
  let lo = 0
  let hi = 1
  const ia = inside(a)
  for (let k = 0; k < 40; k++) {
    const m = (lo + hi) / 2
    const p = [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m]
    if (inside(p) === ia) lo = m
    else hi = m
  }
  const t = ia ? lo : hi
  return snapToBox([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
}

function segBoxCross(a, b) {
  // segmento con ambos extremos fuera que atraviesa el bbox
  const n = 200
  let enter = null
  let exit = null
  for (let i = 1; i < n; i++) {
    const p = [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]
    if (inside(p)) {
      if (!enter) enter = i
      exit = i
    }
  }
  if (!enter) return null
  const pa = [a[0] + ((b[0] - a[0]) * (enter - 1)) / n, a[1] + ((b[1] - a[1]) * (enter - 1)) / n]
  const pb = [a[0] + ((b[0] - a[0]) * (exit + 1)) / n, a[1] + ((b[1] - a[1]) * (exit + 1)) / n]
  const pi = [a[0] + ((b[0] - a[0]) * enter) / n, a[1] + ((b[1] - a[1]) * enter) / n]
  return [segBoxHit(pa, pi), segBoxHit(pi, pb)]
}

function snapToBox([x, y]) {
  const d = [Math.abs(x - minX), Math.abs(x - maxX), Math.abs(y - minY), Math.abs(y - maxY)]
  const k = d.indexOf(Math.min(...d))
  if (k === 0) return [minX, y]
  if (k === 1) return [maxX, y]
  if (k === 2) return [x, minY]
  return [x, maxY]
}

// ---------------------------------------------------------------- heurística de altura
const hash = (n) => {
  let x = Number(n % 2147483647n) || 1
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  return ((x >>> 0) % 10000) / 10000
}

const HISTORIC_BARRIOS = new Set(["Centro", "San Diego", "Getsemaní", "La Matuna"])

function estimateHeight(tags, area, barrio, rnd) {
  const lv = parseFloat(tags["building:levels"])
  if (tags.height) return parseFloat(tags.height)
  if (Number.isFinite(lv)) return lv * 3.6 + 1.2
  const b = tags.building
  if (b === "cathedral" || b === "church" || tags.amenity === "place_of_worship") return 16 + rnd * 4
  if (b === "roof" || b === "carport") return 3.5
  if (b === "garage" || b === "shed" || b === "kiosk") return 3
  if (HISTORIC_BARRIOS.has(barrio) && barrio !== "La Matuna") {
    // casas bajas (1), altas (2), algunas de tres plantas; techos coloniales altos (~4.5 m por planta)
    const levels = rnd < 0.28 ? 1 : rnd < 0.9 ? 2 : 3
    return levels * 4.4 + 1
  }
  if (area > 2500) return 14 + rnd * 10
  if (area > 900) return 9 + rnd * 8
  return 4 + Math.floor(rnd * 3) * 3.2
}

// paletas (índices en el cliente)
// fachadas: 0 ocre, 1 terracota, 2 mostaza, 3 coral, 4 azul colonial, 5 blanco cal, 6 rosa, 7 verde menta, 8 gris moderno
function facadeFor(barrio, tags, rnd) {
  if (tags.amenity === "place_of_worship" || ["church", "cathedral"].includes(tags.building)) return 0
  if (HISTORIC_BARRIOS.has(barrio) && barrio !== "La Matuna") return Math.floor(rnd * 8)
  return rnd < 0.7 ? 8 : 5
}
// techos: 0 teja, 1 teja oscura, 2 placa clara, 3 placa gris
function roofFor(barrio, rnd2) {
  // teja nueva, teja vieja y azoteas (terrazas planas, muy comunes en el Centro)
  if (HISTORIC_BARRIOS.has(barrio) && barrio !== "La Matuna") return rnd2 < 0.5 ? 0 : rnd2 < 0.68 ? 1 : 2
  return rnd2 < 0.6 ? 2 : 3
}

// ---------------------------------------------------------------- main
async function main() {
  if (process.argv.includes("--fetch") || !fs.existsSync(CACHE)) await fetchTiles()
  const { nodes, ways, rels } = loadOsm()
  const P = (id) => {
    const n = nodes.get(id)
    return n ? project(n.lat, n.lon) : null
  }
  const wayPts = (w) => {
    const pts = w.nodes.map(P)
    return pts.every(Boolean) ? pts : null
  }

  /** Polígonos (ways cerrados + multipolígonos) que cumplen un filtro. */
  function polygons(filter) {
    const out = []
    for (const w of ways.values()) {
      const t = w.tags || {}
      if (!filter(t) || w.nodes[0] !== w.nodes[w.nodes.length - 1]) continue
      const pts = wayPts(w)
      if (pts) out.push({ id: BigInt(w.id), tags: t, outer: pts.slice(0, -1), inner: [] })
    }
    for (const r of rels.values()) {
      const t = r.tags || {}
      if (t.type !== "multipolygon" || !filter(t)) continue
      const role = (k) =>
        r.members.filter((m) => m.type === "way" && (m.role || "outer") === k).map((m) => ways.get(m.ref))
      const outerWays = role("outer")
      if (outerWays.some((w) => !w)) continue // relación incompleta en este bbox
      const [outers] = assembleRings(outerWays.map((w) => w.nodes))
      const [inners] = assembleRings(role("inner").filter(Boolean).map((w) => w.nodes))
      for (const ring of outers) {
        const pts = ring.map(P)
        if (!pts.every(Boolean)) continue
        const holes = inners.map((h) => h.map(P)).filter((h) => h.every(Boolean) && pointInRing(h[0], pts))
        out.push({ id: BigInt(r.id), tags: t, outer: pts, inner: holes })
      }
    }
    return out
  }

  const ccw = (r) => (signedArea(r) < 0 ? [...r].reverse() : r)
  const cw = (r) => (signedArea(r) > 0 ? [...r].reverse() : r)
  const flat = (ring) => ring.flatMap(([x, y]) => [q(x), q(y)])

  // barrios
  const barrios = polygons((t) => t.place === "neighbourhood" || t.place === "suburb" || t.place === "quarter")
    .map((p) => ({ name: p.tags.name, ring: p.outer }))
    .filter((b) => b.name)
  const barrioOf = (pt) => barrios.find((b) => pointInRing(pt, b.ring))?.name ?? ""

  // edificios
  const buildings = []
  for (const p of polygons((t) => t.building && t.building !== "no")) {
    const c = centroid(p.outer)
    if (!inside(c)) continue
    const outer = simplify(ccw(p.outer))
    if (outer.length < 3) continue
    const area = Math.abs(signedArea(outer))
    if (area < 6) continue
    const barrio = barrioOf(c)
    const r1 = hash(p.id)
    const r2 = hash(p.id * 7919n)
    const b = {
      p: [flat(outer), ...p.inner.map((h) => flat(simplify(cw(h))))],
      h: Math.round(estimateHeight(p.tags, area, barrio, r1) * 10) / 10,
      f: facadeFor(barrio, p.tags, r2),
      r: roofFor(barrio, r1 * 0.5 + r2 * 0.5),
      b: Math.max(0, barrios.findIndex((x) => x.name === barrio)),
    }
    if (p.tags.name) b.n = p.tags.name
    buildings.push(b)
  }

  // muralla
  const walls = []
  for (const w of ways.values()) {
    const t = w.tags || {}
    if (!(t.barrier === "city_wall" || t.historic === "citywalls" || t.historic === "castle_wall")) continue
    const pts = wayPts(w)
    if (!pts || !pts.some(inside)) continue
    walls.push({ p: flat(pts), n: t.name })
  }

  // calles + grafo peatonal
  const WIDTH = {
    trunk: 14, primary: 12, secondary: 10, tertiary: 8, residential: 6.5, unclassified: 6, service: 4.5,
    pedestrian: 5, living_street: 5, footway: 2.5, path: 2.5, steps: 3, corridor: 2,
    trunk_link: 8, secondary_link: 7, tertiary_link: 6,
  }
  const WALKABLE = new Set(["residential", "unclassified", "service", "pedestrian", "living_street", "footway",
    "path", "steps", "tertiary", "secondary", "primary", "tertiary_link", "secondary_link", "corridor"])
  const streets = []
  const gIndex = new Map()
  const gNodes = []
  const gEdges = []
  const gid = (id) => {
    if (!gIndex.has(id)) {
      const [x, y] = P(id)
      gIndex.set(id, gNodes.length / 2)
      gNodes.push(q(x), q(y))
    }
    return gIndex.get(id)
  }
  for (const w of ways.values()) {
    const t = w.tags || {}
    const width = WIDTH[t.highway]
    if (!width || t.area === "yes") continue
    const pts = wayPts(w)
    if (!pts) continue
    // trozos continuos dentro del bbox
    let run = []
    const runs = []
    w.nodes.forEach((id, i) => {
      if (inside(pts[i])) run.push(i)
      else if (run.length) (runs.push(run), (run = []))
    })
    if (run.length) runs.push(run)
    for (const r of runs) {
      if (r.length < 2) continue
      streets.push({ w: width, p: flat(r.map((i) => pts[i])) })
      if (WALKABLE.has(t.highway) && t.access !== "private" && t.foot !== "no") {
        for (let k = 1; k < r.length; k++) gEdges.push(gid(w.nodes[r[k - 1]]), gid(w.nodes[r[k]]))
      }
    }
  }

  // tierra, agua, verde, plazas
  const coast = []
  for (const w of ways.values()) if (w.tags?.natural === "coastline") coast.push(w.nodes)
  const [coastClosed, coastOpen] = assembleRings(coast)
  const coastChains = [
    ...coastOpen.map((l) => l.map(P)),
    ...coastClosed.map((l) => [...l, l[0]].map(P)),
  ].filter((c) => c.every(Boolean))
  const land = buildLand(coastChains).map(ccw).map(simplify).map(flat)

  const area = (filter) =>
    polygons(filter)
      .map((p) => clipRing(p.outer))
      .filter(Boolean)
      .map((r) => flat(simplify(ccw(r))))
  const water = area((t) => t.natural === "water" || t.waterway === "riverbank")
  const green = area(
    (t) =>
      ["park", "garden", "pitch"].includes(t.leisure) ||
      ["grass", "forest", "recreation_ground", "village_green"].includes(t.landuse) ||
      ["scrub", "wetland", "grassland", "wood"].includes(t.natural),
  )
  const plazas = area((t) => t.place === "square" || (t.highway === "pedestrian" && t.area === "yes"))

  // hitos con nombre (para etiquetas y búsqueda)
  const landmarks = []
  for (const p of polygons((t) => t.name && (t.historic || t.amenity === "place_of_worship" || t.tourism))) {
    const c = centroid(p.outer)
    if (inside(c)) landmarks.push({ n: p.tags.name, x: q(c[0]), y: q(c[1]), k: p.tags.historic || p.tags.amenity || p.tags.tourism })
  }

  const out = {
    v: 1,
    attribution: "© OpenStreetMap contributors (ODbL)",
    origin: ORIGIN,
    scale: 0.1,
    bounds: [q(minX), q(minY), q(maxX), q(maxY)],
    barrios: barrios
      .map((b) => {
        const r = clipRing(b.ring)
        if (!r) return null
        const c = centroid(r)
        return { n: b.name, p: flat(simplify(ccw(r), 2)), c: [q(c[0]), q(c[1])] }
      })
      .filter(Boolean),
    land,
    water,
    green,
    plazas,
    walls,
    streets,
    graph: { n: gNodes, e: gEdges },
    buildings,
    landmarks,
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify(out))
  const kb = (fs.statSync(OUT).size / 1024).toFixed(0)
  console.log(
    `ok → ${path.relative(process.cwd(), OUT)} (${kb} KB): ${buildings.length} edificios, ${walls.length} murallas, ` +
      `${streets.length} calles, ${gNodes.length / 2} nodos de grafo, ${land.length} tierra, ${water.length} agua, ` +
      `${green.length} verde, ${plazas.length} plazas, ${out.barrios.length} barrios, ${landmarks.length} hitos`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
