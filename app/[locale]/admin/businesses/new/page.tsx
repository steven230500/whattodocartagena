import { BusinessForm } from "@/components/admin/business-form"
import { createBusiness } from "../actions"

export default function NewBusinessPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Nuevo comercio</h1>
        <BusinessForm action={createBusiness} submitLabel="Crear" />
      </div>
    </div>
  )
}
