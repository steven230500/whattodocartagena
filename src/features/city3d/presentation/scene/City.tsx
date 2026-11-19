"use client"

import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { useExplorer } from "../state"
import { buildBuildings, buildFlat, buildStreets, buildWalls, LAYER_Y } from "../mesh/geometry"
import { createBuildingMaterial } from "./materials"
import { SURFACES } from "../palette"

/** Distancia máxima (px) entre pointerdown y click para contarlo como toque, no arrastre. */
const TAP_SLOP = 6

export function City({ night }: { night: number }) {
  const { model, state, dispatch, camera, reducedMotion } = useExplorer()
  const invalidate = useThree((s) => s.invalidate)

  const geo = useMemo(() => {
    const buildings = buildBuildings(model)
    const walls = buildWalls(model)
    return {
      buildings,
      walls,
      land: buildFlat(model.land, LAYER_Y.land, SURFACES.land, { depth: 6, hex: SURFACES.shore }),
      water: buildFlat(model.water, LAYER_Y.inlandWater, "#3d8fc4"),
      green: buildFlat(model.green, LAYER_Y.green, SURFACES.green),
      plazas: buildFlat(model.plazas, LAYER_Y.plaza, SURFACES.plaza),
      streets: buildStreets(model),
    }
  }, [model])

  const mat = useMemo(() => createBuildingMaterial(), [])
  const streetMat = useMemo(
    () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, emissive: new THREE.Color("#ffad5c") }),
    [],
  )
  const wallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.92,
        side: THREE.DoubleSide,
        emissive: new THREE.Color("#ff9d4d"),
      }),
    [],
  )
  const merlonMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: SURFACES.wall, roughness: 0.92, emissive: new THREE.Color("#ff9d4d") }),
    [],
  )
  const inlandWaterMat = useRef<THREE.MeshStandardMaterial>(null)

  // liberar GPU al desmontar
  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => {
        if (g instanceof THREE.BufferGeometry) g.dispose()
      })
      geo.buildings.geometry.dispose()
      geo.walls.body.dispose()
      mat.material.dispose()
      mat.depth.dispose()
      streetMat.dispose()
      wallMat.dispose()
      merlonMat.dispose()
    },
    [geo, mat, streetMat, wallMat, merlonMat],
  )

  // noche: ventanas, faroles en las calles, muralla con luz cálida
  useEffect(() => {
    mat.uniforms.uNight.value = night
    streetMat.emissiveIntensity = night * 0.09
    wallMat.emissiveIntensity = night * 0.32
    merlonMat.emissiveIntensity = night * 0.32
    invalidate()
  }, [night, mat, streetMat, wallMat, merlonMat, invalidate])

  useEffect(() => {
    mat.uniforms.uBarrio.value = state.barrio
    mat.uniforms.uSelected.value = state.selection?.type === "building" ? state.selection.id : -1
    invalidate()
  }, [state.barrio, state.selection, mat, invalidate])

  // "levantar la ciudad" al cargar
  const rise = useRef(reducedMotion ? 1 : 0)
  useLayoutEffect(() => {
    mat.uniforms.uRise.value = rise.current
  }, [mat])
  useFrame((_, dt) => {
    if (rise.current >= 1) return
    rise.current = Math.min(1, rise.current + dt / 2.2)
    mat.uniforms.uRise.value = rise.current
    invalidate()
  })

  // almenas instanciadas
  const merlonRef = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const m = merlonRef.current
    if (!m) return
    geo.walls.merlons.forEach((mx, i) => m.setMatrixAt(i, mx))
    m.instanceMatrix.needsUpdate = true
    m.computeBoundingSphere()
  }, [geo])

  const down = useRef<{ x: number; y: number } | null>(null)
  const onBuildingDown = (e: ThreeEvent<PointerEvent>) => {
    down.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
  }
  const onBuildingClick = (e: ThreeEvent<MouseEvent>) => {
    const d = down.current
    if (d && Math.hypot(e.nativeEvent.clientX - d.x, e.nativeEvent.clientY - d.y) > TAP_SLOP) return
    e.stopPropagation()
    const face = e.face
    const attr = geo.buildings.geometry.getAttribute("aId")
    if (!face || !attr) return
    const id = Math.round(attr.getX(face.a))
    if (state.selection?.type === "building" && state.selection.id === id) {
      dispatch({ type: "select", selection: null })
      return
    }
    dispatch({ type: "select", selection: { type: "building", id } })
    const c = geo.buildings.centers
    camera.flyTo(c[id * 3], c[id * 3 + 1], { distance: 180, polar: 0.9 })
  }

  return (
    <group>
      <mesh geometry={geo.land} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <mesh geometry={geo.water} receiveShadow>
        <meshStandardMaterial ref={inlandWaterMat} color="#3d8fc4" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh geometry={geo.green} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <mesh geometry={geo.plazas} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <mesh geometry={geo.streets} material={streetMat} receiveShadow />
      <mesh geometry={geo.walls.body} material={wallMat} castShadow receiveShadow />
      <instancedMesh
        ref={merlonRef}
        args={[undefined, undefined, geo.walls.merlons.length]}
        material={merlonMat}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <mesh
        geometry={geo.buildings.geometry}
        material={mat.material}
        customDepthMaterial={mat.depth}
        castShadow
        receiveShadow
        onPointerDown={onBuildingDown}
        onClick={onBuildingClick}
      />
    </group>
  )
}
