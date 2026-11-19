"use client"

import { useEffect, useMemo, useRef, type ComponentRef } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import { useExplorer } from "../state"
import { pointAlong } from "../../domain/street-graph"
import { LAYER_Y } from "../mesh/geometry"
import { SURFACES } from "../palette"

export const ROUTE_Y = LAYER_Y.street + 0.9
/** velocidad del caminante en el recorrido (m/s de escena, comprimido) */
const SPEED = 38
const PAUSE_AT_STOP = 2.4

/**
 * Ruta activa: línea que se dibuja sola, caminante y cámara que lo sigue en el
 * recorrido. Los números de las paradas son DOM (ver ui/MapOverlay).
 */
export function RouteLayer() {
  const { routePath: path, state, dispatch, controls, camera, reducedMotion } = useExplorer()
  const invalidate = useThree((s) => s.invalidate)
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)

  const points = useMemo(() => {
    if (!path) return null
    const out: THREE.Vector3[] = []
    for (let i = 0; i < path.points.length; i += 2) out.push(new THREE.Vector3(path.points[i], ROUTE_Y, -path.points[i + 1]))
    return out.length >= 2 ? out : null
  }, [path])

  // encuadrar la ruta al elegirla
  useEffect(() => {
    if (!path) return
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (let i = 0; i < path.points.length; i += 2) {
      minX = Math.min(minX, path.points[i]); maxX = Math.max(maxX, path.points[i])
      minY = Math.min(minY, path.points[i + 1]); maxY = Math.max(maxY, path.points[i + 1])
    }
    // distancia para que la ruta entre completa en el campo de visión más angosto
    // (en un celular vertical el horizontal es ~23°, no los 40° verticales)
    const span = Math.max(maxX - minX, maxY - minY, 150)
    const vfov = (cam.fov * Math.PI) / 180
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * (size.width / Math.max(size.height, 1)))
    const fit = (span / 2 / Math.tan(Math.min(vfov, hfov) / 2)) * 1.35
    camera.flyTo((minX + maxX) / 2, (minY + maxY) / 2, { distance: Math.max(fit, 260), polar: 0.75 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, camera])

  const lineRef = useRef<ComponentRef<typeof Line>>(null)
  const draw = useRef(0)
  const dist = useRef(0)
  const pause = useRef(0)
  const lastStop = useRef(0)
  const walker = useRef<THREE.Group>(null)

  useEffect(() => {
    draw.current = reducedMotion ? 1 : 0
    dist.current = 0
    lastStop.current = 0
    invalidate()
  }, [path, reducedMotion, invalidate])

  // parada elegida desde la UI (sin recorrido): mover caminante y cámara
  useEffect(() => {
    if (!path || state.touring) return
    const idx = path.stopIndex[state.stop] ?? 0
    dist.current = path.distances[idx] ?? 0
    lastStop.current = state.stop
    if (state.selection?.type === "stop") {
      const p = pointAlong(path, dist.current)
      camera.flyTo(p.x, p.y, { distance: 240, polar: 0.85 })
    }
    invalidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.stop, path])

  // al darle play desde el final, empezar de nuevo
  useEffect(() => {
    if (!path || !state.touring) return
    if (dist.current >= path.length - 1e-3) {
      dist.current = 0
      lastStop.current = 0
      dispatch({ type: "stop", index: 0 })
    }
    invalidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.touring])

  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, dt) => {
    if (!path || !points) return
    const len = path.length
    const mat = lineRef.current?.material as unknown as { dashOffset: number; dashSize: number; gapSize: number } | undefined
    if (mat) {
      if (draw.current < 1) {
        draw.current = Math.min(1, draw.current + dt / 1.6)
        invalidate()
      }
      const e = 1 - Math.pow(1 - draw.current, 3)
      mat.dashSize = len + 1
      mat.gapSize = len + 1
      mat.dashOffset = (len + 1) * (1 - e)
    }

    if (state.touring) {
      if (pause.current > 0) {
        pause.current -= dt
      } else {
        const next = lastStop.current + 1
        const nextDist = next < path.stopIndex.length ? path.distances[path.stopIndex[next]] : len
        dist.current = reducedMotion ? nextDist : Math.min(dist.current + SPEED * Math.min(dt, 0.5), nextDist)
        if (dist.current >= nextDist - 1e-3) {
          if (next < path.stopIndex.length) {
            lastStop.current = next
            pause.current = PAUSE_AT_STOP
            dispatch({ type: "stop", index: next })
          }
          if (next >= path.stopIndex.length - 1) dispatch({ type: "tour", playing: false })
        }
      }
      invalidate()
    }

    const p = pointAlong(path, dist.current)
    tmp.set(p.x, ROUTE_Y + 2.5, -p.y)
    if (walker.current) {
      walker.current.position.copy(tmp)
      const ring = walker.current.children[1]
      if (ring && state.touring) ring.scale.setScalar(1 + 0.25 * Math.sin(performance.now() / 260))
    }
    const c = controls.current
    if (state.touring && c && !reducedMotion) {
      // cámara detrás y por encima del caminante
      void c.setLookAt(tmp.x - p.dx * 260, 240, tmp.z + p.dy * 260, tmp.x, 0, tmp.z, true)
    }
  })

  if (!path || !points) return null

  return (
    <group>
      {/* halo ancho debajo para que la ruta se lea sobre techos y calles */}
      <Line points={points} color="#ffffff" lineWidth={10} transparent opacity={0.6} depthTest={false} renderOrder={2} />
      <Line
        ref={lineRef}
        points={points}
        color={SURFACES.route}
        lineWidth={5}
        transparent
        opacity={1}
        dashed
        dashSize={path.length + 1}
        gapSize={path.length + 1}
        depthTest={false}
        renderOrder={3}
      />
      <group ref={walker}>
        <mesh renderOrder={4}>
          <sphereGeometry args={[4, 20, 12]} />
          <meshBasicMaterial color={SURFACES.route} depthTest={false} transparent />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={-2} renderOrder={4}>
          <ringGeometry args={[6, 8.5, 32]} />
          <meshBasicMaterial color={SURFACES.route} transparent opacity={0.45} depthTest={false} />
        </mesh>
      </group>
    </group>
  )
}
