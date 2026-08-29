import Link from "next/link"

const LINKS = [
  { href: "/admin/businesses", label: "Comercios" },
  { href: "/admin/events", label: "Eventos" },
  { href: "/admin/parishes", label: "Parroquias" },
  { href: "/admin/plans", label: "Planes" },
  { href: "/admin/routes", label: "Rutas" },
  { href: "/admin/achievements", label: "Logros" },
  { href: "/admin/business-claims", label: "Reclamos" },
]

export function AdminNav() {
  return (
    <nav className="flex gap-4 text-sm text-muted-foreground mb-6">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className="hover:text-coral hover:underline">
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
