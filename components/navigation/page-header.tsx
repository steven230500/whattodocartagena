import type { ReactNode } from "react"
import { Link } from "@/i18n/navigation"
import { RampartDivider } from "@/components/ui/rampart-divider"
import { cn } from "@/lib/utils"

export interface PageHeaderAction {
  label: string
  href: string
  icon?: ReactNode
  primary?: boolean
}

/**
 * Cabecera compacta de las páginas de consulta (rutas, comercios, eventos,
 * planes, misas): título, una línea, datos reales y acciones que llevan a algún
 * lado. En celular deja los filtros y resultados en la primera pantalla; en
 * escritorio suma una foto real del tema, chica y a la derecha.
 */
export function PageHeader({
  title,
  subtitle,
  meta = [],
  actions = [],
  image,
}: {
  title: string
  subtitle: string
  meta?: string[]
  actions?: PageHeaderAction[]
  image?: string
}) {
  return (
    <header className="bg-background pt-8 md:pt-28">
      <div className="container mx-auto grid items-end gap-8 px-4 pb-8 md:grid-cols-[minmax(0,1fr)_20rem] md:pb-10">
        <div className="min-w-0">
          <h1 className="font-serif text-4xl font-bold leading-tight text-balance md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground text-pretty">{subtitle}</p>
          {meta.length > 0 && <p className="mt-3 text-sm font-medium text-foreground/70">{meta.join(" · ")}</p>}
          {actions.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {actions.map((a) => (
                <Link
                  key={a.href + a.label}
                  href={a.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full text-sm font-semibold transition active:translate-y-px",
                    a.primary
                      ? "bg-coral px-5 py-2.5 text-ink hover:bg-coral-dark"
                      : "px-1 py-2.5 text-coral-ink underline-offset-4 hover:underline",
                  )}
                >
                  {a.icon}
                  {a.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="hidden aspect-[4/3] w-full rounded-2xl object-cover md:block" loading="eager" />
        )}
      </div>
      <RampartDivider color="var(--color-colonial-gold)" />
    </header>
  )
}
