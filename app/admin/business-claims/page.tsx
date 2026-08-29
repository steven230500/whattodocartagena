import { getPendingClaims } from "@/lib/api/admin/business-claims"
import { AdminNav } from "@/components/admin/admin-nav"
import { ClaimActions } from "./claim-actions"

export default async function AdminBusinessClaimsPage() {
  const claims = await getPendingClaims()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <AdminNav />
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Reclamos de negocios</h1>

        {claims.length === 0 ? (
          <p className="text-muted-foreground">No hay solicitudes pendientes.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Negocio</th>
                  <th className="px-4 py-3 font-medium">Usuario</th>
                  <th className="px-4 py-3 font-medium">Mensaje</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{c.businessName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.userEmail}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{c.message}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ClaimActions id={c.id} businessSlug={c.businessSlug} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
