import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-stone-warm border-t border-stone-warm/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4 text-coral">Cartagena Viva</h3>
            <p className="text-sm text-stone-warm/70 mb-4">
              Tu guía cultural interactiva para descubrir la historia, tradiciones y belleza de Cartagena de Indias.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-warm/70 hover:text-coral transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-warm/70 hover:text-coral transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-warm/70 hover:text-coral transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-stone-warm/70 hover:text-coral transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-stone-warm/70 hover:text-coral transition-colors">
                  Historia
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-stone-warm/70 hover:text-coral transition-colors">
                  Mapa Interactivo
                </Link>
              </li>
              <li>
                <Link href="/routes" className="text-stone-warm/70 hover:text-coral transition-colors">
                  Rutas Turísticas
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-stone-warm/70 hover:text-coral transition-colors">
                  Explora
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4">Descubre</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore?tag=cultura" className="text-stone-warm/70 hover:text-coral transition-colors">
                  Cultura Viva
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-stone-warm/70 hover:text-coral transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="text-stone-warm/70 hover:text-coral transition-colors">
                  Comercios
                </Link>
              </li>
              <li>
                <Link href="/masses" className="text-stone-warm/70 hover:text-coral transition-colors">
                  Servicios Útiles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2 text-stone-warm/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Cartagena de Indias, Colombia</span>
              </li>
              <li className="flex items-center space-x-2 text-stone-warm/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@whattodocartagena.com" className="hover:text-coral transition-colors">
                  info@whattodocartagena.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-stone-warm/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+57 300 123 4567</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-warm/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-stone-warm/70">
            © {new Date().getFullYear()} Cartagena Viva. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/privacidad" className="text-stone-warm/70 hover:text-coral transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-stone-warm/70 hover:text-coral transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>

      {/* Developer Credit */}
      <div className="bg-black/20 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-stone-warm/70">
            Desarrollado by{" "}
            <a
              href="https://stevenpatino.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral hover:text-coral-dark font-semibold transition-colors"
            >
              Steven Patiño
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
