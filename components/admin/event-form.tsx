"use client"

import { useActionState } from "react"
import type { AdminEvent } from "@/lib/api/admin/events"
import type { EventFormState } from "@/app/admin/events/actions"

interface EventFormProps {
  action: (prevState: EventFormState | undefined, formData: FormData) => Promise<EventFormState>
  event?: AdminEvent
  submitLabel: string
}

export function EventForm({ action, event, submitLabel }: EventFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título" name="title" defaultValue={event?.title} required />
        <Field label="Slug" name="slug" defaultValue={event?.slug} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Fecha inicio (YYYY-MM-DD)" name="startDate" defaultValue={event?.startDate} required />
        <Field label="Fecha fin (opcional)" name="endDate" defaultValue={event?.endDate} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipo" name="type" defaultValue={event?.type} required />
        <Field label="Lugar" name="venue" defaultValue={event?.venue} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitud" name="lat" type="number" step="any" defaultValue={event?.coords.lat} />
        <Field label="Longitud" name="lng" type="number" step="any" defaultValue={event?.coords.lng} />
      </div>

      <Field label="Imagen (ruta en /public)" name="image" defaultValue={event?.image} />
      <Field label="Tags (separados por coma)" name="tags" defaultValue={event?.tags?.join(", ")} />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={event?.description}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-muted-foreground mb-1">
          Contenido (texto largo, opcional)
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={event?.content}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="px-6 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  step,
}: {
  label: string
  name: string
  defaultValue?: string | number
  required?: boolean
  type?: string
  step?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
      />
    </div>
  )
}
