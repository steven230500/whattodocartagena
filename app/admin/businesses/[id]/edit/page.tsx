import { notFound } from "next/navigation"
import { BusinessForm } from "@/components/admin/business-form"
import { getAdminBusinessById } from "@/lib/api/admin/businesses"
import { updateBusiness } from "../../actions"

interface EditBusinessPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBusinessPage({ params }: EditBusinessPageProps) {
  const { id } = await params
  const business = await getAdminBusinessById(id)

  if (!business) {
    notFound()
  }

  const action = updateBusiness.bind(null, id)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Editar {business.name}</h1>
        <BusinessForm action={action} business={business} submitLabel="Guardar cambios" />
      </div>
    </div>
  )
}
