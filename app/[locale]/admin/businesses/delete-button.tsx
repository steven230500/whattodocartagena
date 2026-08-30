"use client"

import { useTransition } from "react"
import { deleteBusiness } from "./actions"

export function DeleteBusinessButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`¿Borrar "${name}"? No se puede deshacer.`)) return
        startTransition(() => {
          deleteBusiness(id)
        })
      }}
      className="text-destructive hover:underline disabled:opacity-50"
    >
      {pending ? "Borrando..." : "Borrar"}
    </button>
  )
}
