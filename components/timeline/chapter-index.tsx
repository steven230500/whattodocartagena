"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface ChapterLink {
  id: string
  year: string
  title: string
}

/**
 * Índice de años de /history: fijo al costado en escritorio y como franja
 * deslizable bajo la cabecera en celular. Lleva a cada capítulo y marca el que
 * se está leyendo (IntersectionObserver, sin escuchar cada evento de scroll).
 */
export function ChapterIndex({ chapters, label }: { chapters: ChapterLink[]; label: string }) {
  const [current, setCurrent] = useState(chapters[0]?.id)

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setCurrent(visible[0].target.id)
      },
      { rootMargin: "-30% 0px -60% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [chapters])

  return (
    <nav aria-label={label} className="sticky top-14 z-20 -mx-4 self-start bg-background/95 px-4 py-2 md:top-28 md:mx-0 md:bg-transparent md:p-0">
      <ol className="flex gap-1 overflow-x-auto md:flex-col md:gap-0 md:overflow-visible md:border-l-2 md:border-colonial-gold/60">
        {chapters.map((c) => {
          const active = c.id === current
          return (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-full px-3 py-1.5 text-sm tabular-nums transition-colors md:-ml-0.5 md:rounded-none md:border-l-2 md:px-4 md:py-2",
                  active
                    ? "bg-ink text-background md:border-colonial-gold md:bg-transparent md:font-semibold md:text-ink"
                    : "text-foreground/70 hover:text-ink md:border-transparent",
                )}
              >
                <span className="font-serif text-base">{c.year}</span>
                <span className="hidden whitespace-normal text-xs text-foreground/70 md:block">{c.title}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
