import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const root = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@/features": root("./src/features"),
      "@/domain": root("./src/shared/domain"),
      "@/shared": root("./src/shared"),
      "@/src": root("./src"),
      "@": root("."),
    },
  },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
  },
})
