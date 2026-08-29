"use client"

import Link from "next/link"
import { Home, AlertTriangle } from "lucide-react"
import "./globals.css"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-2xl w-full text-center">
            {/* Illustration */}
            <div className="mb-8 relative">
              <div className="text-[180px] font-bold text-[var(--color-destructive)]/20 leading-none select-none">
                500
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <AlertTriangle className="w-24 h-24 text-[var(--color-destructive)]" />
              </div>
            </div>

            {/* Content */}
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Error crítico del sistema
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Ocurrió un error grave en la aplicación. Por favor, intenta recargar la página o vuelve al inicio.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white rounded-lg font-medium hover:bg-coral-dark transition-colors"
              >
                Recargar página
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
      </body>
    </html>
  )
}
