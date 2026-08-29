import Link from "next/link"
import { getAdminPlans } from "@/lib/api/admin/plans"
import { AdminNav } from "@/components/admin/admin-nav"
import { DeletePlanButton } from "./delete-button"

export default async function AdminPlansPage() {
  const plans = await getAdminPlans()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <AdminNav />
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Planes</h1>
          <Link
            href="/admin/plans/new"
            className="px-4 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors"
          >
            + Nuevo plan
          </Link>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Barrio</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.neighborhood}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.price === "free" ? "Gratis" : p.priceAmount || "Pago"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/admin/plans/${p.id}/edit`} className="text-coral hover:underline">
                      Editar
                    </Link>
                    <DeletePlanButton id={p.id} title={p.title} />
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
