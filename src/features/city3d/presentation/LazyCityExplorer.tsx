"use client"

import dynamic from "next/dynamic"
import type { CityExplorerProps } from "./CityExplorer"

/** three.js solo se descarga en el navegador y solo en las páginas que lo usan. */
const CityExplorer = dynamic(() => import("./CityExplorer"), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100dvh-4rem)] w-full bg-[radial-gradient(ellipse_at_center,#2c3f7a_0%,#141d38_70%)] max-md:h-[calc(100dvh-7.5rem-env(safe-area-inset-bottom))]" />
  ),
})

export default function LazyCityExplorer(props: CityExplorerProps) {
  return <CityExplorer {...props} />
}
