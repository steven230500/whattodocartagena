import Link from "next/link"
import { getAdminAchievements } from "@/lib/api/admin/achievements"
import { AdminNav } from "@/components/admin/admin-nav"
import { DeleteAchievementButton } from "./delete-button"

export const dynamic = "force-dynamic"

export default async function AdminAchievementsPage() {
  const achievements = await getAdminAchievements()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <AdminNav />
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Logros</h1>
          <Link
            href="/admin/achievements/new"
            className="px-4 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors"
          >
            + Nuevo logro
          </Link>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Criterio</th>
                <th className="px-4 py-3 font-medium">Umbral</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{a.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.criteriaType}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.threshold}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/admin/achievements/${a.id}/edit`} className="text-coral hover:underline">
                      Editar
                    </Link>
                    <DeleteAchievementButton id={a.id} title={a.title} />
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
