"use client"

import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { useExplorer } from "../state"
import { buildBuildings, buildFlat, buildStreets, buildWalls, LAYER_Y } from "../mesh/geometry"
import { CityMaterials } from "./materials"
import { SURFACES } from "../palette"
import { Landmarks } from "./Landmarks"

/** Distancia máxima (px) entre pointerdown y click para contarlo como toque, no arrastre. */
const TAP_SLOP = 6

export function City({ night }: { night: number }) {
  const { model, state, dispatch, camera, reducedMotion, selectedBuilding } = useExplorer()
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

  const mats = useMemo(() => new CityMaterials(SURFACES.wall), [])
  const inlandWaterMat = useRef<THREE.MeshStandardMaterial>(null)

  // liberar GPU al desmontar
  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => {
        if (g instanceof THREE.BufferGeometry) g.dispose()
      })
      geo.buildings.geometry.dispose()
      geo.walls.body.dispose()
      mats.dispose()
    },
    [geo, mats],
  )

  useEffect(() => {
    mats.setNight(night)
    invalidate()
  }, [night, mats, invalidate])

  useEffect(() => {
    mats.setFocus(state.barrio, selectedBuilding, state.hover)
    invalidate()
  }, [state.barrio, selectedBuilding, state.hover, mats, invalidate])

  // "levantar la ciudad" al cargar
  const rise = useRef(reducedMotion ? 1 : 0)
  useLayoutEffect(() => {
    mats.setRise(rise.current)
  }, [mats])
  useFrame((_, dt) => {
    if (rise.current >= 1) return
    rise.current = Math.min(1, rise.current + dt / 2.2)
    mats.setRise(rise.current)
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
      <mesh geometry={geo.streets} material={mats.street} receiveShadow />
      <mesh geometry={geo.walls.body} material={mats.wall} castShadow receiveShadow />
      <instancedMesh
        ref={merlonRef}
        args={[undefined, undefined, geo.walls.merlons.length]}
        material={mats.merlon}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <mesh
        geometry={geo.buildings.geometry}
        material={mats.building.material}
        customDepthMaterial={mats.building.depth}
        castShadow
        receiveShadow
        onPointerDown={onBuildingDown}
        onClick={onBuildingClick}
      />
      <Landmarks night={night} rise={rise} />
    </group>
  )
}
