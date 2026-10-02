import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/events", "/routes", "/businesses", "/history", "/map", "/explore", "/masses", "/plans"]
  return paths.flatMap((path) => ["", "/en"].map((prefix) => ({
    url: `${siteUrl}${prefix}${path}`,
    alternates: { languages: { es: `${siteUrl}${path}`, en: `${siteUrl}/en${path}` } },
  })))
}
