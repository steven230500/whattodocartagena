"use client"

import { useActionState } from "react"
import { login } from "./actions"

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form action={formAction} className="w-full max-w-sm space-y-4 border border-border rounded-lg p-8 bg-card">
        <h1 className="font-serif text-2xl font-bold text-foreground">Panel Admin</h1>
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-muted-foreground mb-2">
            Contraseña
          </label>
          <input
            id="key"
            name="key"
            type="password"
            required
            autoFocus
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full px-4 py-2 bg-coral hover:bg-coral-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
