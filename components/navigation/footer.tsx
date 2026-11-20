import { Link } from "@/i18n/navigation"
import { Mail, MapPin } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { RampartDivider } from "@/components/ui/rampart-divider"

export async function Footer() {
  const t = await getTranslations("footer")

  return (
    <>
    {/* el footer remata como la muralla que sostiene la página */}
    <RampartDivider color="var(--foreground)" />
    <footer className="bg-foreground text-stone-warm border-t border-stone-warm/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4 text-coral">{t("brand")}</h3>
            <p className="text-sm text-stone-warm/70 mb-4">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-stone-warm/70 hover:text-coral transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-stone-warm/70 hover:text-coral transition-colors">
                  {t("history")}
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-stone-warm/70 hover:text-coral transition-colors">
                  {t("interactiveMap")}
                </Link>
              </li>
              <li>
                <Link href="/routes" className="text-stone-warm/70 hover:text-coral transition-colors">
                  {t("walkingRoutes")}
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-stone-warm/70 hover:text-coral transition-colors">
                  {t("explore")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4">{t("discover")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore?tag=cultura" className="text-stone-warm/70 hover:text-coral transition-colors">
                  {t("livingCulture")}
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-stone-warm/70 hover:text-coral transition-colors">
                  {t("events")}
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="text-stone-warm/70 hover:text-coral transition-colors">
                  {t("businesses")}
                </Link>
              </li>
              <li>
                <Link href="/masses" className="text-stone-warm/70 hover:text-coral transition-colors">
                  {t("usefulServices")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("contact")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2 text-stone-warm/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t("location")}</span>
              </li>
              <li className="flex items-center space-x-2 text-stone-warm/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@whattodocartagena.com" className="hover:text-coral transition-colors">
                  info@whattodocartagena.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-warm/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-stone-warm/70">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/privacidad" className="text-stone-warm/70 hover:text-coral transition-colors">
              {t("privacy")}
            </Link>
            <Link href="/terminos" className="text-stone-warm/70 hover:text-coral transition-colors">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>

      {/* Developer Credit */}
      <div className="bg-black/20 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-stone-warm/70">
            {t("developedBy")}{" "}
            <a
              href="https://stevenpatino.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral hover:text-coral-light font-semibold transition-colors"
            >
              Steven Patiño
            </a>
          </p>
        </div>
      </div>
    </footer>
    </>
  )
}
