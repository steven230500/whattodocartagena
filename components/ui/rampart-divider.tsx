/**
 * Signature motif (DESIGN.md): silueta de las almenas de la muralla,
 * usada con disciplina como divisor de sección en vez de un border-b genérico.
 */
export function RampartDivider({
  className = "",
  color = "var(--color-stone)",
}: {
  className?: string
  color?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`h-4 w-full ${className}`}
      style={{
        backgroundColor: color,
        clipPath:
          "polygon(0% 100%,0% 40%,8% 40%,8% 0%,16% 0%,16% 40%,24% 40%,24% 0%,32% 0%,32% 40%,40% 40%,40% 0%,48% 0%,48% 40%,56% 40%,56% 0%,64% 0%,64% 40%,72% 40%,72% 0%,80% 0%,80% 40%,88% 40%,88% 0%,96% 0%,96% 40%,100% 40%,100% 100%)",
      }}
    />
  )
}
