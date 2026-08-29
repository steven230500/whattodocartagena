import Link from "next/link"
import { getAdminRoutes } from "@/lib/api/admin/routes"
import { AdminNav } from "@/components/admin/admin-nav"
import { DeleteRouteButton } from "./delete-button"

export default async function AdminRoutesPage() {
  const routes = await getAdminRoutes()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <AdminNav />
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Rutas</h1>
          <Link
            href="/admin/routes/new"
            className="px-4 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors"
          >
            + Nueva ruta
          </Link>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Pasos</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{r.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.steps.length}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/admin/routes/${r.id}/edit`} className="text-coral hover:underline">
                      Editar
                    </Link>
                    <DeleteRouteButton id={r.id} title={r.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
