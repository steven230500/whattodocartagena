import Link from "next/link"
import { Home, MapPin } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-stone-warm)] via-white to-[var(--color-caribbean-blue)]/10 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration */}
        <div className="mb-8 relative">
          <div className="text-[180px] font-bold text-[var(--color-coral)]/20 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-24 h-24 text-[var(--color-coral)] animate-float" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
          ¡Ups! Te perdiste en Cartagena
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-md mx-auto">
          La página que buscas no existe o ha sido movida. No te preocupes, te ayudaremos a encontrar el camino de
          vuelta.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-coral)] text-white rounded-lg font-medium hover:bg-[var(--color-coral-dark)] transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground border-2 border-border rounded-lg font-medium hover:bg-secondary transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Ver el mapa
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center gap-8 opacity-30">
          <div
            className="w-16 h-16 rounded-full bg-[var(--color-caribbean-blue)] animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-12 h-12 rounded-full bg-[var(--color-colonial-gold)] animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="w-20 h-20 rounded-full bg-[var(--color-coral)] animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>
    </div>
  )
}
