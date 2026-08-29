"use client"

import { useActionState } from "react"
import type { MyBusiness } from "@/lib/api/my-business"
import type { MyBusinessFormState } from "@/app/my-business/actions"

interface MyBusinessFormProps {
  action: (prevState: MyBusinessFormState | undefined, formData: FormData) => Promise<MyBusinessFormState>
  business: MyBusiness
}

export function MyBusinessForm({ action, business }: MyBusinessFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={business.description}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
        />
      </div>

      <Field label="Imagen (ruta en /public)" name="image" defaultValue={business.image} />
      <Field label="Tags (separados por coma)" name="tags" defaultValue={business.tags?.join(", ")} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Horario" name="hours" defaultValue={business.hours} />
        <Field label="Rango de precio ($, $$, $$$)" name="price_hint" defaultValue={business.priceHint} />
      </div>

      <Field label="Nota sobre precio típico" name="price_typical_note" defaultValue={business.priceTypicalNote} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Teléfono" name="phone" defaultValue={business.phone} />
        <Field label="Web" name="web" defaultValue={business.web} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" name="email" defaultValue={business.email} />
        <Field label="Instagram" name="instagram" defaultValue={business.instagram} />
      </div>

      <p className="text-xs text-muted-foreground">
        Nombre, slug, tipo, barrio, ubicación y la marca "Verificado" las administra el equipo del sitio —
        escribinos si necesitás cambiarlas.
      </p>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="px-6 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string
  name: string
  defaultValue?: string
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
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
      />
    </div>
  )
}
