"use client"

import { useActionState, useState } from "react"
import type { Route } from "@/lib/api/routes"
import type { RouteFormState, StepPayload } from "@/app/admin/routes/actions"

interface RouteFormProps {
  action: (prevState: RouteFormState | undefined, formData: FormData) => Promise<RouteFormState>
  route?: Route
  submitLabel: string
}

function stepsFromRoute(route?: Route): StepPayload[] {
  if (!route) return []
  return route.steps.map((s) => ({
    title: s.title,
    description: s.description,
    audio_url: s.audioUrl ?? null,
    duration: s.duration ?? null,
    lat: s.coordinates?.lat ?? null,
    lng: s.coordinates?.lng ?? null,
    image: s.image ?? null,
  }))
}

export function RouteForm({ action, route, submitLabel }: RouteFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [steps, setSteps] = useState<StepPayload[]>(stepsFromRoute(route))

  function updateStep(index: number, patch: Partial<StepPayload>) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  function addStep() {
    setSteps((prev) => [
      ...prev,
      { title: "", description: "", audio_url: null, duration: null, lat: null, lng: null, image: null },
    ])
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <input type="hidden" name="steps_json" value={JSON.stringify(steps)} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Título" name="title" defaultValue={route?.title} required />
        <Field label="Slug" name="slug" defaultValue={route?.slug} required />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={route?.description}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Duración (ej. 2-3 horas)" name="duration" defaultValue={route?.duration} />
        <Field label="Distancia (ej. 3.2 km)" name="distance" defaultValue={route?.distance} />
        <Field label="Dificultad" name="difficulty" defaultValue={route?.difficulty} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoría" name="category" defaultValue={route?.category} required />
        <Field label="Precio (ej. Gratis, $25 USD)" name="price" defaultValue={route?.price} />
      </div>

      <Field label="Imagen (ruta en /public)" name="image" defaultValue={route?.image} />
      <Field label="Puntos destacados (separados por coma)" name="highlights" defaultValue={route?.highlights?.join(", ")} />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="audio_guide" defaultChecked={route?.audioGuide} />
          Tiene audio guía
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="offline" defaultChecked={route?.offline} />
          Disponible offline
        </label>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Pasos de la ruta</h3>
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-coral hover:underline"
          >
            + Agregar paso
          </button>
        </div>

        {steps.length === 0 && <p className="text-sm text-muted-foreground mb-2">Todavía no hay pasos.</p>}

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Paso {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-xs text-destructive hover:underline"
                >
                  Eliminar
                </button>
              </div>
              <input
                placeholder="Título"
                value={step.title}
                onChange={(e) => updateStep(index, { title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
              <textarea
                placeholder="Descripción"
                value={step.description}
                onChange={(e) => updateStep(index, { description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Duración (ej. 8 min)"
                  value={step.duration ?? ""}
                  onChange={(e) => updateStep(index, { duration: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
                <input
                  placeholder="URL de audio"
                  value={step.audio_url ?? ""}
                  onChange={(e) => updateStep(index, { audio_url: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  placeholder="Latitud"
                  type="number"
                  step="any"
                  value={step.lat ?? ""}
                  onChange={(e) => updateStep(index, { lat: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
                <input
                  placeholder="Longitud"
                  type="number"
                  step="any"
                  value={step.lng ?? ""}
                  onChange={(e) => updateStep(index, { lng: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
                <input
                  placeholder="Imagen"
                  value={step.image ?? ""}
                  onChange={(e) => updateStep(index, { image: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
              </div>
            </div>
          ))}
        </div>
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

