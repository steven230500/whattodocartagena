import { redirect } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/navigation/header"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/api/auth"
import { getMyBusinesses, getMyClaims } from "@/lib/api/my-business"

const STATUS_LABEL: Record<string, string> = {
  pending: "En revisión",
  approved: "Aprobado",
  rejected: "Rechazado",
}

export default async function MyBusinessPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const [businesses, claims] = await Promise.all([getMyBusinesses(), getMyClaims()])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">Mi negocio</h1>

          {businesses.length > 0 && (
            <div className="mb-10">
              <h2 className="font-semibold text-foreground mb-4">Negocios que administrás</h2>
              <div className="space-y-3">
                {businesses.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <span className="font-medium text-foreground">{b.name}</span>
                    <Link href={`/my-business/${b.id}/edit`} className="text-coral hover:underline text-sm">
                      Editar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {claims.length > 0 && (
            <div className="mb-10">
              <h2 className="font-semibold text-foreground mb-4">Tus solicitudes</h2>
              <div className="space-y-3">
                {claims.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <span className="text-foreground">{c.businessName}</span>
                    <Badge
                      variant="outline"
                      className={
                        c.status === "approved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : c.status === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : ""
                      }
                    >
                      {STATUS_LABEL[c.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {businesses.length === 0 && claims.length === 0 && (
            <p className="text-muted-foreground">
              Todavía no reclamaste ningún negocio. Buscá tu negocio en{" "}
              <Link href="/businesses" className="text-coral hover:underline">
                el listado de comercios
              </Link>{" "}
              y reclamalo desde su página.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
