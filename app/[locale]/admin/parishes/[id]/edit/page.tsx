import { notFound } from "next/navigation"
import { ParishForm } from "@/components/admin/parish-form"
import { getAdminParishById } from "@/lib/api/admin/parishes"
import { updateParish } from "../../actions"

export const dynamic = "force-dynamic"

interface EditParishPageProps {
  params: Promise<{ id: string }>
}

export default async function EditParishPage({ params }: EditParishPageProps) {
  const { id } = await params
  const parish = await getAdminParishById(id)

  if (!parish) {
    notFound()
  }

  const action = updateParish.bind(null, id)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Editar {parish.name}</h1>
        <ParishForm action={action} parish={parish} submitLabel="Guardar cambios" />
      </div>
    </div>
  )
}
