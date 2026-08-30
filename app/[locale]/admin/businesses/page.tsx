import Link from "next/link"
import { getAdminBusinesses } from "@/lib/api/admin/businesses"
import { AdminNav } from "@/components/admin/admin-nav"
import { DeleteBusinessButton } from "./delete-button"

export const dynamic = "force-dynamic"

export default async function AdminBusinessesPage() {
  const businesses = await getAdminBusinesses()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <AdminNav />
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Comercios</h1>
          <Link
            href="/admin/businesses/new"
            className="px-4 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors"
          >
            + Nuevo comercio
          </Link>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Barrio</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{b.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.barrio}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.contact.phone || "—"}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/admin/businesses/${b.id}/edit`} className="text-coral hover:underline">
                      Editar
                    </Link>
                    <DeleteBusinessButton id={b.id} name={b.name} />
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
