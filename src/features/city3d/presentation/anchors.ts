import * as THREE from "three"

interface Anchor {
  el: HTMLElement
  pos: THREE.Vector3
}

/**
 * Pines y etiquetas como DOM normal (una sola capa, accesible, sin raíces de React
 * por pin). Un componente dentro del Canvas proyecta cada punto 3D a pantalla en
 * cada cuadro y escribe solo `transform` / `visibility`.
 */
export class AnchorRegistry {
  private items = new Map<string, Anchor>()
  private v = new THREE.Vector3()
  /** lo asigna AnchorSync: pide un cuadro cuando cambia algo fuera del Canvas */
  private onChange: () => void = () => {}

  setOnChange(fn: () => void) {
    this.onChange = fn
  }

  register(id: string, el: HTMLElement | null, pos: [number, number, number]) {
    if (!el) {
      this.items.delete(id)
      return
    }
    const prev = this.items.get(id)
    if (prev && prev.el === el) prev.pos.set(...pos)
    else {
      el.style.visibility = "hidden"
      this.items.set(id, { el, pos: new THREE.Vector3(...pos) })
    }
    this.onChange()
  }

  update(camera: THREE.Camera, width: number, height: number) {
    for (const { el, pos } of this.items.values()) {
      this.v.copy(pos).project(camera)
      const visible = this.v.z < 1 && Math.abs(this.v.x) < 1.15 && Math.abs(this.v.y) < 1.15
      el.style.visibility = visible ? "visible" : "hidden"
      if (!visible) continue
      const x = ((this.v.x + 1) / 2) * width
      const y = ((1 - this.v.y) / 2) * height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
    }
  }
}
