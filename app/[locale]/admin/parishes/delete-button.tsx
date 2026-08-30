"use client"

import { useTransition } from "react"
import { deleteParish } from "./actions"

export function DeleteParishButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`¿Borrar "${name}"? No se puede deshacer.`)) return
        startTransition(() => {
          deleteParish(id)
        })
      }}
      className="text-destructive hover:underline disabled:opacity-50"
    >
      {pending ? "Borrando..." : "Borrar"}
    </button>
  )
}
