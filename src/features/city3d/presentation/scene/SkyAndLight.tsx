"use client"

import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useExplorer } from "../state"
import { LAYER_Y } from "../mesh/geometry"
import { createSkyMaterial, paintSky } from "./materials"
import type { LightPalette, SunPosition } from "../../domain/sun"
import { sunDirection } from "../../domain/sun"

const SHADOW_SPAN = 650

/**
 * Cielo, niebla, mar, sol y luz ambiente según la hora.
 * El sol (o la "luna" de noche) sigue al objetivo de la cámara para que la
 * sombra tenga resolución donde se está mirando.
 */
export function SkyAndLight({ sun, palette, shadows }: { sun: SunPosition; palette: LightPalette; shadows: boolean }) {
  const { controls } = useExplorer()
  const scene = useThree((s) => s.scene)
  const invalidate = useThree((s) => s.invalidate)
  const light = useRef<THREE.DirectionalLight>(null)
  const sky = useMemo(() => createSkyMaterial(), [])

  // de noche la luz principal viene "de la luna": alta, desde el este
  const dir = useMemo(() => {
    const below = sun.altitude < 0.02
    const [x, y, z] = below ? sunDirection({ altitude: 0.75, azimuth: 1.9 }) : sunDirection(sun)
    // mínima altura para que las sombras al amanecer no sean infinitas
    return new THREE.Vector3(x, Math.max(z, 0.12), -y).normalize()
  }, [sun])

  useEffect(() => {
    paintSky(scene, sky, palette.skyTop, palette.skyHorizon)
    invalidate()
  }, [palette, sky, scene, invalidate])

  useEffect(() => () => sky.dispose(), [sky])

  const target = useRef(new THREE.Vector3())
  useFrame(() => {
    const l = light.current
    const c = controls.current
    if (!l) return
    if (c) c.getTarget(target.current)
    l.target.position.copy(target.current)
    l.position.copy(target.current).addScaledVector(dir, 1500)
    l.target.updateMatrixWorld()
  })

  return (
    <>
      <mesh scale={9000} material={sky} renderOrder={-1}>
        <sphereGeometry args={[1, 32, 16]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={LAYER_Y.water} receiveShadow>
        <planeGeometry args={[30000, 30000]} />
        <meshStandardMaterial color={palette.water} roughness={0.28} metalness={0.15} />
      </mesh>
      <ambientLight color={palette.ambient} intensity={palette.ambientIntensity} />
      <hemisphereLight args={[palette.skyTop, "#d8c7a8", 0.35]} />
      <directionalLight
        ref={light}
        color={palette.sun}
        intensity={palette.sunIntensity}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.6}
        shadow-camera-left={-SHADOW_SPAN}
        shadow-camera-right={SHADOW_SPAN}
        shadow-camera-top={SHADOW_SPAN}
        shadow-camera-bottom={-SHADOW_SPAN}
        shadow-camera-near={10}
        shadow-camera-far={3500}
      />
    </>
  )
}
