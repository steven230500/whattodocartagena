import type { Metadata } from "next"

export const metadata: Metadata = { title: "Crear cuenta | What to do Cartagena", robots: { index: false, follow: false, noarchive: true } }

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children
}
