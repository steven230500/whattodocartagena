import Link from "next/link"
import { getAdminParishes } from "@/lib/api/admin/parishes"
import { AdminNav } from "@/components/admin/admin-nav"
import { DeleteParishButton } from "./delete-button"

export default async function AdminParishesPage() {
  const parishes = await getAdminParishes()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <AdminNav />
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Parroquias</h1>
          <Link
            href="/admin/parishes/new"
            className="px-4 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors"
          >
            + Nueva parroquia
          </Link>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Barrio</th>
                <th className="px-4 py-3 font-medium">Horarios</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {parishes.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.neighborhood}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.schedules.length}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/admin/parishes/${p.id}/edit`} className="text-coral hover:underline">
                      Editar
                    </Link>
                    <DeleteParishButton id={p.id} name={p.name} />
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
