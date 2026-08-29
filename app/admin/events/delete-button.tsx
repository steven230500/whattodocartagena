"use client"

import { useTransition } from "react"
import { deleteEvent } from "./actions"

export function DeleteEventButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`¿Borrar "${title}"? No se puede deshacer.`)) return
        startTransition(() => {
          deleteEvent(id)
        })
      }}
      className="text-destructive hover:underline disabled:opacity-50"
    >
      {pending ? "Borrando..." : "Borrar"}
    </button>
  )
}
