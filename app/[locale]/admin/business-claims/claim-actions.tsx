"use client"

import { useTransition } from "react"
import { approveClaim, rejectClaim } from "./actions"

export function ClaimActions({ id, businessSlug }: { id: string; businessSlug: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => approveClaim(id, businessSlug))}
        className="text-coral hover:underline disabled:opacity-50"
      >
        Aprobar
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("¿Rechazar esta solicitud?")) return
          startTransition(() => rejectClaim(id))
        }}
        className="text-destructive hover:underline disabled:opacity-50"
      >
        Rechazar
      </button>
    </div>
  )
}
