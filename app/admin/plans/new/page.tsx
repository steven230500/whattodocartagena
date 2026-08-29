import { PlanForm } from "@/components/admin/plan-form"
import { createPlan } from "../actions"

export default function NewPlanPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Nuevo plan</h1>
        <PlanForm action={createPlan} submitLabel="Crear" />
      </div>
    </div>
  )
}
