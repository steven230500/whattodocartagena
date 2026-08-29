"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Home, RefreshCw, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("[v0] Error boundary caught:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration */}
        <div className="mb-8 relative">
          <div className="text-[180px] font-bold text-[var(--color-destructive)]/20 leading-none select-none">500</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-24 h-24 text-[var(--color-destructive)]" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
          ¡Algo salió mal!
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-md mx-auto">
          Ocurrió un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left max-w-lg mx-auto">
            <p className="text-sm font-mono text-destructive break-all">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white rounded-lg font-medium hover:bg-coral-dark transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card text-foreground border-2 border-border rounded-lg font-medium hover:bg-secondary transition-colors"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
