import { RouteForm } from "@/components/admin/route-form"
import { createRoute } from "../actions"

export default function NewRoutePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Nueva ruta</h1>
        <RouteForm action={createRoute} submitLabel="Crear" />
      </div>
    </div>
  )
}
