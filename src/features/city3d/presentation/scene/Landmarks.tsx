"use client"

import { useEffect, useMemo, useRef, type RefObject } from "react"
import * as THREE from "three"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { useExplorer } from "../state"
import { buildLandmarks, type LandmarkMesh } from "../mesh/landmarks"
import { paintLandmark } from "./materials"

const TAP_SLOP = 6

/**
 * Monumentos con modelo propio. De noche quedan iluminados con reflectores
 * cálidos; seleccionados o bajo el cursor, se tiñen de coral.
 */
export function Landmarks({ night, rise }: { night: number; rise: RefObject<number> }) {
  const { model, selectedBuilding, state } = useExplorer()
  const meshes = useMemo(() => buildLandmarks(model), [model])
  useEffect(() => () => meshes.forEach((m) => m.geometry.dispose()), [meshes])

  return (
    <group>
      {meshes.map((m) => (
        <Landmark
          key={m.key}
          mesh={m}
          night={night}
          rise={rise}
          selected={selectedBuilding === m.buildingId}
          hovered={state.hover === m.buildingId}
        />
      ))}
    </group>
  )
}

function Landmark({
  mesh,
  night,
  rise,
  selected,
  hovered,
}: {
  mesh: LandmarkMesh
  night: number
  rise: RefObject<number>
  selected: boolean
  hovered: boolean
}) {
  const { state, dispatch, camera } = useExplorer()
  const invalidate = useThree((s) => s.invalidate)
  const ref = useRef<THREE.Mesh>(null)
  const material = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }), [])
  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    paintLandmark(material, selected, hovered, night)
    invalidate()
  }, [material, selected, hovered, night, invalidate])

  // crecer con el resto de la ciudad al cargar
  useFrame(() => {
    const m = ref.current
    if (!m) return
    const [cx, cy] = mesh.center
    const d = Math.hypot(cx, cy) / 1700
    const k = Math.min(1, Math.max(0, ((rise.current ?? 1) * 1.6 - d) / 0.6))
    m.scale.y = Math.max(0.001, 1 - Math.pow(1 - k, 3))
  })

  const down = useRef<{ x: number; y: number } | null>(null)
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    down.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
  }
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    const d = down.current
    if (d && Math.hypot(e.nativeEvent.clientX - d.x, e.nativeEvent.clientY - d.y) > TAP_SLOP) return
    e.stopPropagation()
    if (state.selection?.type === "building" && state.selection.id === mesh.buildingId) {
      dispatch({ type: "select", selection: null })
      return
    }
    dispatch({ type: "select", selection: { type: "building", id: mesh.buildingId } })
    camera.flyTo(mesh.center[0], mesh.center[1], { distance: Math.max(160, mesh.height * 6), polar: 1.0, height: mesh.height / 3 })
  }

  return (
    <mesh
      ref={ref}
      geometry={mesh.geometry}
      material={material}
      castShadow
      receiveShadow
      onPointerDown={onDown}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        dispatch({ type: "hover", id: mesh.buildingId })
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        dispatch({ type: "hover", id: -1 })
        document.body.style.cursor = ""
      }}
    />
  )
}
