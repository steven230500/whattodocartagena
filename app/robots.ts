import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  // Private routes expose noindex in metadata and HTTP headers.
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${siteUrl}/sitemap.xml` }
}
