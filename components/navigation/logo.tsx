/**
 * Marca del sitio. Usa el motivo signature (DESIGN.md) — silueta de almenas —
 * en vez del icono-en-caja-de-color genérico.
 */
export function Logo({ size = "default" }: { size?: "default" | "sm" }) {
  const isSm = size === "sm"

  return (
    <a href="/" className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 20" className={isSm ? "h-5 w-8 shrink-0" : "h-6 w-9 shrink-0"} aria-hidden="true">
        <rect x="0" y="8" width="32" height="12" className="fill-coral" />
        <rect x="0" y="0" width="6" height="9" className="fill-coral" />
        <rect x="9" y="0" width="6" height="9" className="fill-coral" />
        <rect x="18" y="0" width="6" height="9" className="fill-coral" />
        <rect x="27" y="0" width="5" height="9" className="fill-coral" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-serif font-bold text-foreground ${isSm ? "text-lg" : "text-xl"}`}>Cartagena</span>
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">Viva</span>
      </span>
    </a>
  )
}
