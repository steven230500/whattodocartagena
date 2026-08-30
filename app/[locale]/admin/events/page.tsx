import Link from "next/link"
import { getAdminEvents } from "@/lib/api/admin/events"
import { AdminNav } from "@/components/admin/admin-nav"
import { DeleteEventButton } from "./delete-button"

export const dynamic = "force-dynamic"

export default async function AdminEventsPage() {
  const events = await getAdminEvents()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <AdminNav />
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Eventos</h1>
          <Link
            href="/admin/events/new"
            className="px-4 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors"
          >
            + Nuevo evento
          </Link>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Lugar</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{e.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.startDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.venue}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/admin/events/${e.id}/edit`} className="text-coral hover:underline">
                      Editar
                    </Link>
                    <DeleteEventButton id={e.id} title={e.title} />
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
