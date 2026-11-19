/**
 * Firma visual (DESIGN.md): la silueta de las almenas de la muralla.
 * Proporción fija (merlón de 28 px, hueco de 16 px, 12 px de alto) a cualquier
 * ancho, y siempre del color de la superficie que cierra: así se lee como el
 * borde de esa superficie y no como un adorno suelto.
 */
export function RampartDivider({
  className = "",
  color = "var(--background)",
}: {
  className?: string
  color?: string
}) {
  const mask =
    "linear-gradient(#000 0 0) bottom / 100% 5px no-repeat, repeating-linear-gradient(90deg, #000 0 28px, transparent 28px 44px)"
  return (
    <div
      aria-hidden="true"
      className={`h-3 w-full ${className}`}
      style={{ backgroundColor: color, WebkitMask: mask, mask }}
    />
  )
}
