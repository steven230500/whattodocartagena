"use client"

import { useActionState } from "react"
import type { Plan } from "@/lib/types/plan"
import type { PlanFormState } from "@/app/[locale]/admin/plans/actions"

interface PlanFormProps {
  action: (prevState: PlanFormState | undefined, formData: FormData) => Promise<PlanFormState>
  plan?: Plan
  submitLabel: string
}

export function PlanForm({ action, plan, submitLabel }: PlanFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field label="Título" name="title" defaultValue={plan?.title} required />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={plan?.description}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipo" name="type" defaultValue={plan?.type} required />
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-muted-foreground mb-1">
            Precio
          </label>
          <select
            id="price"
            name="price"
            defaultValue={plan?.price ?? "free"}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="free">Gratis</option>
            <option value="paid">Pago</option>
          </select>
        </div>
      </div>

      <Field label="Monto (si es pago)" name="priceAmount" defaultValue={plan?.priceAmount} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Fecha/recurrencia" name="date" defaultValue={plan?.date} />
        <Field label="Horario" name="time" defaultValue={plan?.time} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Lugar" name="location" defaultValue={plan?.location} />
        <Field label="Barrio" name="neighborhood" defaultValue={plan?.neighborhood} required />
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
