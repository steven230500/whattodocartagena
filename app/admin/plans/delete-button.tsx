"use client"

import { useTransition } from "react"
import { deletePlan } from "./actions"

export function DeletePlanButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`¿Borrar "${title}"? No se puede deshacer.`)) return
        startTransition(() => {
          deletePlan(id)
        })
      }}
      className="text-destructive hover:underline disabled:opacity-50"
    >
      {pending ? "Borrando..." : "Borrar"}
    </button>
  )
}
