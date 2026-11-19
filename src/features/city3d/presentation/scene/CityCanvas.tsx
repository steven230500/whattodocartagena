"use client"

import { useEffect, useMemo, useState } from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { CameraControls, PerformanceMonitor } from "@react-three/drei"
import CameraControlsImpl from "camera-controls"
import { useExplorer } from "../state"
import { City } from "./City"
import { SkyAndLight } from "./SkyAndLight"
import { RouteLayer } from "./RouteLayer"
import { AnchorSync, ViewOffset } from "./Sync"
import { cartagenaDateAt, paletteFor, sunPosition } from "../../domain/sun"

const { ACTION } = CameraControlsImpl

export interface Quality {
  dpr: [number, number]
  shadows: boolean
}

/** Calidad inicial según el dispositivo; PerformanceMonitor la baja si hay tirones. */
export function detectQuality(): Quality {
  if (typeof window === "undefined") return { dpr: [1, 1.5], shadows: false }
  if (isSoftwareRenderer()) return { dpr: [1, 1], shadows: false }
  const coarse = window.matchMedia("(pointer: coarse)").matches
  const cores = navigator.hardwareConcurrency ?? 4
  if (coarse) return { dpr: [1, cores >= 8 ? 1.75 : 1.4], shadows: cores >= 8 }
  return { dpr: [1, 2], shadows: true }
}

/** Equipos sin GPU (o con la GPU bloqueada) renderizan por CPU: ahí, calidad mínima. */
function isSoftwareRenderer() {
  try {
    const gl = document.createElement("canvas").getContext("webgl")
    const ext = gl?.getExtension("WEBGL_debug_renderer_info")
    const name = ext ? String(gl!.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ""
    gl?.getExtension("WEBGL_lose_context")?.loseContext()
    return /swiftshader|llvmpipe|software|basic render/i.test(name)
  } catch {
    return false
  }
}

export interface CityCanvasProps {
  onReady?: () => void
  onContextLost?: () => void
  onContextRestored?: () => void
}

export default function CityCanvas({ onReady, onContextLost, onContextRestored }: CityCanvasProps) {
  const { model, state, controls, camera, dispatch } = useExplorer()
  const [quality, setQuality] = useState<Quality>(() => detectQuality())

  const { sun, palette } = useMemo(() => {
    const date = cartagenaDateAt(state.minutes)
    const s = sunPosition(date, model.origin.lat, model.origin.lng)
    return { sun: s, palette: paletteFor(s.altitude) }
  }, [state.minutes, model.origin])

  const boundary = useMemo(() => {
    const b = model.bounds
    return new THREE.Box3(new THREE.Vector3(b.minX + 150, -10, -(b.maxY - 150)), new THREE.Vector3(b.maxX - 150, 200, -(b.minY + 150)))
  }, [model.bounds])

  return (
    <Canvas
      frameloop="demand"
      dpr={quality.dpr}
      shadows={quality.shadows ? "soft" : false}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 40, near: 5, far: 20000, position: [-420, 1250, 1350] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        const canvas = gl.domElement
        canvas.dataset.city3dCanvas = ""
        // three.js ya llama preventDefault y reconstruye su estado al recuperar el contexto
        canvas.addEventListener("webglcontextlost", () => onContextLost?.())
        canvas.addEventListener("webglcontextrestored", () => onContextRestored?.())
        onReady?.()
      }}
      onPointerMissed={() => state.selection && dispatch({ type: "select", selection: null })}
      aria-label="Mapa 3D de Cartagena"
    >
      <PerformanceMonitor
        onDecline={() => setQuality((q) => ({ dpr: [1, Math.max(1, q.dpr[1] - 0.5)], shadows: false }))}
      />
      <CameraControls
        ref={controls}
        makeDefault
        minDistance={70}
        maxDistance={2600}
        minPolarAngle={0.12}
        maxPolarAngle={1.22}
        dollyToCursor
        smoothTime={0.35}
        draggingSmoothTime={0.08}
        boundaryEnclosesCamera={false}
        mouseButtons={{ left: ACTION.TRUCK, middle: ACTION.DOLLY, right: ACTION.ROTATE, wheel: ACTION.DOLLY }}
        touches={{ one: ACTION.TOUCH_TRUCK, two: ACTION.TOUCH_DOLLY_ROTATE, three: ACTION.TOUCH_ROTATE }}
      />
      <InitialView boundary={boundary} onReady={() => camera.overview()} />
      <SkyAndLight sun={sun} palette={palette} shadows={quality.shadows} />
      <City night={palette.night} />
      <RouteLayer />
      <ViewOffset />
      <AnchorSync />
    </Canvas>
  )
}

/** Corre dentro del Canvas, cuando CameraControls ya está montado. */
function InitialView({ boundary, onReady }: { boundary: THREE.Box3; onReady: () => void }) {
  const { controls, state } = useExplorer()
  useEffect(() => {
    const c = controls.current
    if (!c) return
    c.setBoundary(boundary)
    c.boundaryFriction = 0.2
    if (!state.routeId) onReady()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
