"use client"

import { useActionState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Header } from "@/components/navigation/header"
import { login } from "./actions"

export default function LoginPage() {
  const t = useTranslations("auth.login")
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-background px-4 md:pt-16">
      <form action={formAction} className="w-full max-w-sm space-y-4 border border-border rounded-lg p-8 bg-card">
        <h1 className="font-serif text-2xl font-bold text-foreground">{t("title")}</h1>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
            {t("email")}
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
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full px-4 py-2 bg-coral hover:bg-coral-dark text-ink rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {pending ? t("submitting") : t("submit")}
        </button>
        <p className="text-sm text-muted-foreground text-center">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-coral-ink hover:underline">
            {t("registerLink")}
          </Link>
        </p>
      </form>
    </div>
    </>
  )
}
