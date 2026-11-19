"use client"

import { useEffect, useLayoutEffect } from "react"
import type * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useExplorer } from "../state"

/** Proyecta los anclas DOM (pines, etiquetas) en cada cuadro renderizado. */
export function AnchorSync() {
  const { anchors } = useExplorer()
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    anchors.setOnChange(invalidate)
    invalidate()
    return () => anchors.setOnChange(() => {})
  }, [anchors, invalidate])
  useFrame(({ camera, size }) => anchors.update(camera, size.width, size.height))
  return null
}

/** Ancho del panel lateral en escritorio y alto de la hoja inferior en celular (px). */
const PANEL_DESKTOP = 376
const SHEET_MOBILE = 140

/**
 * Corre el centro óptico de la cámara hacia la zona libre de paneles, para que
 * "volar a X" deje a X centrado en lo que se ve y no detrás del panel.
 */
export function ViewOffset() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const invalidate = useThree((s) => s.invalidate)
  useLayoutEffect(() => {
    const desktop = size.width >= 768
    const dx = desktop ? -PANEL_DESKTOP / 2 : 0
    const dy = desktop ? 40 : SHEET_MOBILE / 2
    camera.setViewOffset(size.width, size.height, dx, dy, size.width, size.height)
    invalidate()
    return () => camera.clearViewOffset()
  }, [camera, size, invalidate])
  return null
}
