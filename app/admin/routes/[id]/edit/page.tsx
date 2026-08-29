import { notFound } from "next/navigation"
import { RouteForm } from "@/components/admin/route-form"
import { getAdminRouteById } from "@/lib/api/admin/routes"
import { updateRoute } from "../../actions"

export const dynamic = "force-dynamic"

interface EditRoutePageProps {
  params: Promise<{ id: string }>
}

export default async function EditRoutePage({ params }: EditRoutePageProps) {
  const { id } = await params
  const route = await getAdminRouteById(id)

  if (!route) {
    notFound()
  }

  const action = updateRoute.bind(null, id)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Editar {route.title}</h1>
        <RouteForm action={action} route={route} submitLabel="Guardar cambios" />
      </div>
    </div>
  )
}
