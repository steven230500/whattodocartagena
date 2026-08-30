"use client"

import { useActionState } from "react"
import type { Parish } from "@/lib/types/parish"
import type { ParishFormState } from "@/app/[locale]/admin/parishes/actions"
import { serializeSchedules } from "@/lib/admin/schedules"

interface ParishFormProps {
  action: (prevState: ParishFormState | undefined, formData: FormData) => Promise<ParishFormState>
  parish?: Parish
  submitLabel: string
}

export function ParishForm({ action, parish, submitLabel }: ParishFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field label="Nombre" name="name" defaultValue={parish?.name} required />
      <Field label="Dirección" name="address" defaultValue={parish?.address} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Barrio" name="neighborhood" defaultValue={parish?.neighborhood} required />
        <Field label="Teléfono" name="phone" defaultValue={parish?.phone} />
      </div>

      <div>
        <label htmlFor="schedules" className="block text-sm font-medium text-muted-foreground mb-1">
          Horarios — una línea por día: <code>Día: hora1, hora2, hora3</code>
        </label>
        <textarea
          id="schedules"
          name="schedules"
          defaultValue={parish?.schedules ? serializeSchedules(parish.schedules) : ""}
          rows={5}
          placeholder={"Lunes a Viernes: 7:00 AM, 12:00 PM, 6:00 PM\nSábados: 7:00 AM, 6:00 PM"}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono text-sm"
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
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
      />
    </div>
  )
}
