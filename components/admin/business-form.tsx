"use client"

import { useActionState } from "react"
import type { AdminBusiness } from "@/lib/api/admin/businesses"
import type { BusinessFormState } from "@/app/[locale]/admin/businesses/actions"
import { ImageUploadField } from "@/components/forms/image-upload-field"

interface BusinessFormProps {
  action: (prevState: BusinessFormState | undefined, formData: FormData) => Promise<BusinessFormState>
  business?: AdminBusiness
  submitLabel: string
}

export function BusinessForm({ action, business, submitLabel }: BusinessFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre" name="name" defaultValue={business?.name} required />
        <Field label="Slug" name="slug" defaultValue={business?.slug} required />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Tipo" name="type" defaultValue={business?.type} required />
        <Field label="Subtipo" name="subtype" defaultValue={business?.subtype} />
        <Field label="Barrio" name="barrio" defaultValue={business?.barrio} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitud" name="lat" type="number" step="any" defaultValue={business?.coords.lat} />
        <Field label="Longitud" name="lng" type="number" step="any" defaultValue={business?.coords.lng} />
      </div>

      <ImageUploadField name="image" label="Imagen" defaultValue={business?.image} />

      <Field
        label="Tags (separados por coma)"
        name="tags"
        defaultValue={business?.tags?.join(", ")}
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={business?.description}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
        />
      </div>

      <div>
        <label htmlFor="description_en" className="block text-sm font-medium text-muted-foreground mb-1">
          Descripción (Inglés)
        </label>
        <textarea
          id="description_en"
          name="description_en"
          defaultValue={business?.descriptionEn}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Horario" name="hours" defaultValue={business?.hours} />
        <Field label="Rango de precio ($, $$, $$$)" name="price_hint" defaultValue={business?.priceHint} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Teléfono" name="phone" defaultValue={business?.contact.phone} />
        <Field label="Web" name="web" defaultValue={business?.contact.web} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" name="email" defaultValue={business?.contact.email} />
        <Field label="Instagram" name="instagram" defaultValue={business?.contact.instagram} />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="verified" defaultChecked={business?.verified} />
        Verificado
      </label>

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
