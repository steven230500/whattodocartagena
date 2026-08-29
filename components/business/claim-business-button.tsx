"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { claimBusiness } from "@/app/actions/business-claims"
import type { ClaimStatus } from "@/lib/api/business-claims"

interface ClaimBusinessButtonProps {
  slug: string
  claimStatus: ClaimStatus | null
}

export function ClaimBusinessButton({ slug, claimStatus }: ClaimBusinessButtonProps) {
  const [status, setStatus] = useState(claimStatus)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (status === "pending") {
    return <p className="text-sm text-muted-foreground">Tu solicitud para administrar este negocio está en revisión.</p>
  }

  if (status === "approved") {
    return <p className="text-sm text-muted-foreground">Ya administrás este negocio.</p>
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Store className="w-4 h-4 mr-2" />
        ¿Es tu negocio? Reclamalo
      </Button>
    )
  }

  return (
    <div className="space-y-2 max-w-sm">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Contanos por qué este negocio es tuyo (opcional)"
        rows={2}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await claimBusiness(slug, message)
              if (result === "unauthorized") {
                router.push("/login")
                return
              }
              if (result === "already-claimed") {
                setError("Este negocio ya tiene dueño.")
                return
              }
              if (result === "error") {
                setError("No se pudo enviar la solicitud. Probá de nuevo.")
                return
              }
              setStatus("pending")
            })
          }}
          className="bg-coral hover:bg-coral-dark text-white"
        >
          {pending ? "Enviando..." : "Enviar solicitud"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
