import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // El único prefijo de idioma visible es /en (español es default, sin prefijo) —
  // sacarlo alcanza para chequear la ruta real sin importar el idioma.
  const pathWithoutLocale = pathname.startsWith("/en/") || pathname === "/en" ? pathname.slice(3) || "/" : pathname

  if (pathWithoutLocale.startsWith("/admin") && pathWithoutLocale !== "/admin/login") {
    const hasAdminKey = request.cookies.has("admin_key")
    if (!hasAdminKey) {
      const loginUrl = pathname.startsWith("/en") ? "/en/admin/login" : "/admin/login"
      return NextResponse.redirect(new URL(loginUrl, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|uploads|.*\\..*).*)"],
}
