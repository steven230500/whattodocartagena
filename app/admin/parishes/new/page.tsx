import { ParishForm } from "@/components/admin/parish-form"
import { createParish } from "../actions"

export default function NewParishPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Nueva parroquia</h1>
        <ParishForm action={createParish} submitLabel="Crear" />
      </div>
    </div>
  )
}
