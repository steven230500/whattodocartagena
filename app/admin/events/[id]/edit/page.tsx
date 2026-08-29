import { notFound } from "next/navigation"
import { EventForm } from "@/components/admin/event-form"
import { getAdminEventById } from "@/lib/api/admin/events"
import { updateEvent } from "../../actions"

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const event = await getAdminEventById(id)

  if (!event) {
    notFound()
  }

  const action = updateEvent.bind(null, id)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Editar {event.title}</h1>
        <EventForm action={action} event={event} submitLabel="Guardar cambios" />
      </div>
    </div>
  )
}
