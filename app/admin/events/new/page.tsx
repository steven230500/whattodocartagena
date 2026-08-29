import { EventForm } from "@/components/admin/event-form"
import { createEvent } from "../actions"

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Nuevo evento</h1>
        <EventForm action={createEvent} submitLabel="Crear" />
      </div>
    </div>
  )
}
