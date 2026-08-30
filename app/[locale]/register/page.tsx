"use client"

import { useActionState } from "react"
import Link from "next/link"
import { register } from "./actions"

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form action={formAction} className="w-full max-w-sm space-y-4 border border-border rounded-lg p-8 bg-card">
        <h1 className="font-serif text-2xl font-bold text-foreground">Crear cuenta</h1>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-coral"
          />
          <p className="text-xs text-muted-foreground mt-1">Mínimo 8 caracteres.</p>
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full px-4 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {pending ? "Creando cuenta..." : "Crear cuenta"}
        </button>
        <p className="text-sm text-muted-foreground text-center">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-coral hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  )
}
