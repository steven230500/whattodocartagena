"use client"

import { useActionState } from "react"
import type { AdminAchievement } from "@/lib/api/admin/achievements"
import type { AchievementFormState } from "@/app/[locale]/admin/achievements/actions"
import { ACHIEVEMENT_ICON_KEYS } from "@/lib/achievements/icon-map"

interface AchievementFormProps {
  action: (prevState: AchievementFormState | undefined, formData: FormData) => Promise<AchievementFormState>
  achievement?: AdminAchievement
  submitLabel: string
}

export function AchievementForm({ action, achievement, submitLabel }: AchievementFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Código" name="code" defaultValue={achievement?.code} required />
        <Field label="Título" name="title" defaultValue={achievement?.title} required />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={achievement?.description}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-muted-foreground mb-1">
            Ícono
          </label>
          <select
            id="icon"
            name="icon"
            defaultValue={achievement?.icon ?? ACHIEVEMENT_ICON_KEYS[0]}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            {ACHIEVEMENT_ICON_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="criteria_type" className="block text-sm font-medium text-muted-foreground mb-1">
            Criterio
          </label>
          <select
            id="criteria_type"
            name="criteria_type"
            defaultValue={achievement?.criteriaType ?? "routes_completed"}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="routes_completed">Rutas completadas</option>
            <option value="favorites_count">Favoritos guardados</option>
          </select>
        </div>

        <Field
          label="Umbral"
          name="threshold"
          type="number"
          defaultValue={achievement?.threshold?.toString()}
          required
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
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
  type?: string
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
        defaultValue={defaultValue}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
      />
    </div>
  )
}
