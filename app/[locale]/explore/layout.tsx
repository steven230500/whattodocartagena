import { publicPageMetadata } from "@/lib/seo"

export const generateMetadata = () => publicPageMetadata("explore")

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return children
}
