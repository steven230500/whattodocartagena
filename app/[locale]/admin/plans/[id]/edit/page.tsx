import { notFound } from "next/navigation"
import { PlanForm } from "@/components/admin/plan-form"
import { getAdminPlanById } from "@/lib/api/admin/plans"
import { updatePlan } from "../../actions"

export const dynamic = "force-dynamic"

interface EditPlanPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPlanPage({ params }: EditPlanPageProps) {
  const { id } = await params
  const plan = await getAdminPlanById(id)

  if (!plan) {
    notFound()
  }

  const action = updatePlan.bind(null, id)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Editar {plan.title}</h1>
        <PlanForm action={action} plan={plan} submitLabel="Guardar cambios" />
      </div>
    </div>
  )
}
