// Pruebas end-to-end del mapa 3D (/map/3d) contra una API simulada.
// No son parte de `pnpm test`: necesitan Chromium. Correr con `pnpm test:e2e`;
// PLAYWRIGHT_CHROMIUM_EXECUTABLE usa un Chromium local en vez de
// `pnpm exec playwright install chromium`.
import { defineConfig } from "@playwright/test"

const site = "http://localhost:3199"
const api = "http://127.0.0.1:4899"
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "*.spec.mjs",
  workers: 1,
  fullyParallel: false,
  // WebGL por software (SwiftShader) es lento: cada página tarda en levantar la ciudad
  timeout: 150_000,
  expect: { timeout: 30_000 },
  reporter: [["list"]],
  use: {
    baseURL: site,
    locale: "es-CO",
    timezoneId: "America/Bogota",
    // sin animaciones de cámara ni del caminante: las pruebas no dependen del tiempo
    reducedMotion: "reduce",
    launchOptions: {
      executablePath,
      // Chromium headless solo dibuja WebGL con SwiftShader si se le permite
      args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
    },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1280, height: 860 } } },
    {
      name: "mobile",
      use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    },
  ],
  webServer: [
    { command: "node tests/e2e/mock-api.mjs", url: `${api}/__state`, reuseExistingServer: false, env: { MOCK_API_PORT: "4899" } },
    {
      command: "pnpm exec next dev --port 3199",
      url: `${site}/map/3d`,
      reuseExistingServer: false,
      timeout: 180_000,
      env: { API_URL: api },
    },
  ],
})
