"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { claimBusiness } from "@/app/actions/business-claims"
import type { ClaimStatus } from "@/lib/api/business-claims"

interface ClaimBusinessButtonProps {
  slug: string
  claimStatus: ClaimStatus | null
}

export function ClaimBusinessButton({ slug, claimStatus }: ClaimBusinessButtonProps) {
  const t = useTranslations("commerce.claim")
  const [status, setStatus] = useState(claimStatus)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (status === "pending") {
    return <p className="text-sm text-muted-foreground">{t("pendingReview")}</p>
  }

  if (status === "approved") {
    return <p className="text-sm text-muted-foreground">{t("alreadyManaging")}</p>
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
        {t("cta")}
      </Button>
    )
  }

  return (
    <div className="space-y-2 max-w-sm">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t("placeholder")}
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
                setError(t("alreadyClaimed"))
                return
              }
              if (result === "error") {
                setError(t("error"))
                return
              }
              setStatus("pending")
            })
          }}
          className="bg-coral hover:bg-coral-dark text-ink"
        >
          {pending ? t("submitting") : t("submit")}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          {t("cancel")}
        </Button>
      </div>
    </div>
  )
}
