// Mapa 3D "Cartagena viva" (/map/3d): carga, lugares, filtros, hora del día,
// barrios, rutas con recorrido y progreso guardado, enlaces desde la app y
// recuperación cuando el navegador pierde el contexto WebGL.
import { expect, test } from "@playwright/test"

const API = "http://127.0.0.1:4899"
const isMobile = (testInfo) => testInfo.project.name === "mobile"

/** Abre el explorador y espera a que la ciudad esté dibujada. */
async function openCity(page, path = "/map/3d") {
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  await page.goto(path)
  await expect(page.locator("[data-city3d-stage][data-ready]")).toBeAttached({ timeout: 90_000 })
  await expect(page.locator("[data-city3d-canvas]")).toBeVisible()
  return errors
}

/** En celular la hoja inferior arranca plegada: abrirla o cerrarla. */
async function sheet(page, testInfo, open) {
  if (!isMobile(testInfo)) return
  const handle = page.locator('[role="button"][aria-expanded]')
  if ((await handle.getAttribute("aria-expanded")) !== String(open)) await handle.click()
  await expect(handle).toHaveAttribute("aria-expanded", String(open))
}

const tab = (page, name) => page.getByRole("tab", { name, exact: true })

test.beforeEach(async ({ request }) => {
  await request.get(`${API}/__reset`)
})

test("la ciudad carga con los lugares de la app y sin errores", async ({ page }) => {
  const errors = await openCity(page)
  // 6 sitios curados + 2 negocios de la API
  await expect(page.locator("[data-pin]")).toHaveCount(8)
  await expect(page.locator('[data-barrio="Getsemaní"]')).toBeAttached()
  await expect(page.getByText("© OpenStreetMap contributors")).toBeVisible()
  expect(errors).toEqual([])
})

test("elegir un lugar de la lista abre su tarjeta y marca su pin", async ({ page }, testInfo) => {
  const errors = await openCity(page)
  await sheet(page, testInfo, true)
  await page.locator('[data-place="biz-cafe-e2e"]').click()

  const card = page.locator('[data-card="place"]').filter({ visible: true })
  await expect(card).toContainText("Café E2E")
  await expect(card.getByRole("link", { name: /Ver detalles/ })).toHaveAttribute("href", /\/businesses\/cafe-e2e$/)
  const pin = page.locator('[data-pin="biz-cafe-e2e"]')
  await expect(pin).toHaveAttribute("data-state", "selected")

  // cerrar desde la tarjeta
  await card.getByRole("button", { name: "Cerrar" }).click()
  await expect(pin).toHaveAttribute("data-state", "idle")
  expect(errors).toEqual([])
})

test("los filtros por tipo ocultan y devuelven los pines", async ({ page }, testInfo) => {
  await openCity(page)
  await sheet(page, testInfo, true)
  const food = page.getByRole("button", { name: /^Comer/ })
  await food.click()
  await expect(food).toHaveAttribute("aria-pressed", "false")
  // el único lugar de comida es Café E2E
  await expect(page.locator("[data-pin]")).toHaveCount(7)
  await food.click()
  await expect(page.locator("[data-pin]")).toHaveCount(8)
})

test("la hora del día cambia la luz y la frase, y vuelve a la hora real", async ({ page }, testInfo) => {
  await openCity(page)
  await sheet(page, testInfo, true)
  const stage = page.locator("[data-city3d-stage]")
  const live = page.locator("[data-live]").filter({ visible: true })

  await page.locator('[data-preset="night"]').filter({ visible: true }).click()
  await expect(stage).toHaveAttribute("data-night", "")
  await expect(page.locator('[data-moment="night"]').filter({ visible: true })).toContainText("Noche")
  await expect(live).toHaveAttribute("data-live", "off")

  await page.locator('[data-preset="noon"]').filter({ visible: true }).click()
  await expect(stage).not.toHaveAttribute("data-night", "")
  await expect(page.locator('[data-moment="noon"]').filter({ visible: true })).toBeVisible()

  await live.click()
  await expect(live).toHaveAttribute("data-live", "on")
})

test("elegir un barrio lo pone en foco y se puede volver a toda la ciudad", async ({ page }, testInfo) => {
  await openCity(page)
  await sheet(page, testInfo, true)
  await tab(page, "Barrios").click()
  await page.locator('[data-barrio-item="Getsemaní"]').click()
  await expect(page.locator('[data-barrio="Getsemaní"]')).toHaveAttribute("aria-pressed", "true")

  await sheet(page, testInfo, true)
  await page.locator("[data-barrio-clear]").click()
  await expect(page.locator('[data-barrio="Getsemaní"]')).toHaveAttribute("aria-pressed", "false")
})

test("una ruta se traza con sus paradas y el recorrido llega hasta el final", async ({ page }, testInfo) => {
  const errors = await openCity(page)
  await sheet(page, testInfo, true)
  await tab(page, "Rutas").click()
  // la ruta sin coordenadas no aparece
  await expect(page.locator('[data-route="ruta-sin-mapa"]')).toHaveCount(0)
  await page.locator('[data-route="ruta-e2e"]').click()

  const stops = page.locator("[data-stop]")
  await expect(stops).toHaveCount(3)
  // con una ruta activa los pines de lugares se ocultan
  await expect(page.locator("[data-pin]")).toHaveCount(0)
  await expect(stops.nth(0)).toHaveAttribute("data-state", "current")

  await sheet(page, testInfo, true)
  await page.getByRole("button", { name: "Recorrer la ruta" }).click()
  await expect(page.locator('[data-stop="1"]')).toHaveAttribute("data-state", "current", { timeout: 45_000 })
  await expect(page.locator('[data-stop="2"]')).toHaveAttribute("data-state", "current", { timeout: 45_000 })
  await expect(page.locator('[data-stop="0"]')).toHaveAttribute("data-state", "done")

  const card = page.locator('[data-card="stop"]').filter({ visible: true })
  await expect(card).toContainText("Parada 3 de 3")
  await expect(card.getByRole("link", { name: /Abrir ruta/ })).toHaveAttribute("href", /\/routes\/ruta-e2e$/)
  expect(errors).toEqual([])
})

test("el enlace directo abre la ruta elegida", async ({ page }) => {
  await openCity(page, "/map/3d?route=ruta-e2e")
  await expect(page.locator("[data-stop]")).toHaveCount(3)
  await expect(tab(page, "Rutas")).toHaveAttribute("aria-selected", "true")
  // la cámara encuadra la ruta completa también en un celular vertical
  for (const i of [0, 1, 2]) await expect(page.locator(`[data-stop="${i}"]`)).toBeVisible()
})

test("con sesión retoma el progreso guardado y guarda las paradas nuevas", async ({ page, context, request }, testInfo) => {
  await context.addCookies([{ name: "user_token", value: "e2e-token", domain: "localhost", path: "/" }])
  await openCity(page)
  await sheet(page, testInfo, true)
  await tab(page, "Rutas").click()
  await expect(page.locator('[data-progress="ruta-e2e"]')).toContainText("2 de 3 paradas")

  await page.locator('[data-route="ruta-e2e"]').click()
  await expect(page.locator('[data-stop="1"]')).toHaveAttribute("data-state", "current")
  await expect(page.locator('[data-stop="0"]')).toHaveAttribute("data-state", "done")

  await page.locator('[data-stop="2"]').click()
  await expect
    .poll(async () => (await (await request.get(`${API}/__state`)).json()).progressPuts, { timeout: 15_000 })
    .toContainEqual({ routeId: "r-e2e", step: 2 })
})

test("sin sesión la ruta empieza de cero y no se guarda nada", async ({ page, request }) => {
  await openCity(page, "/map/3d?route=ruta-e2e")
  await expect(page.locator('[data-stop="0"]')).toHaveAttribute("data-state", "current")
  await page.locator('[data-stop="1"]').click()
  await expect(page.locator('[data-stop="1"]')).toHaveAttribute("data-state", "current")
  await page.waitForTimeout(1500)
  const state = await (await request.get(`${API}/__state`)).json()
  expect(state.progressPuts).toEqual([])
})

test("un contexto WebGL perdido muestra el póster y la ciudad vuelve", async ({ page }) => {
  await openCity(page)
  const poster = page.locator("[data-city3d-poster]")
  await expect(poster).toHaveClass(/opacity-0/)

  await page.locator("[data-city3d-canvas]").evaluate((canvas) => {
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    window.__loseContext = gl.getExtension("WEBGL_lose_context")
    window.__loseContext.loseContext()
  })
  await expect(poster).toHaveClass(/opacity-100/)
  await expect(page.locator("[data-city3d-pins]")).toBeHidden()

  await page.evaluate(() => window.__loseContext.restoreContext())
  await expect(poster).toHaveClass(/opacity-0/)
  await expect(page.locator("[data-city3d-pins]")).toBeVisible()
})

test("si el contexto no vuelve, la ciudad se reconstruye en un canvas nuevo", async ({ page }) => {
  await openCity(page)
  await page.locator("[data-city3d-canvas]").evaluate((canvas) => {
    canvas.dataset.old = "1"
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    gl.getExtension("WEBGL_lose_context").loseContext()
  })
  await expect(page.locator("[data-city3d-pins]")).toBeHidden()
  await expect
    .poll(() => page.locator("[data-city3d-canvas]").evaluate((c) => c.dataset.old ?? "nuevo"), { timeout: 20_000 })
    .toBe("nuevo")
  await expect(page.locator("[data-city3d-pins]")).toBeVisible({ timeout: 60_000 })
})

test("sin WebGL ofrece el mapa clásico", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
      return String(type).startsWith("webgl") ? null : original.call(this, type, ...rest)
    }
  })
  await page.goto("/map/3d")
  await expect(page.locator('[data-city3d][data-status="no-webgl"]')).toBeAttached({ timeout: 60_000 })
  await expect(page.getByRole("link", { name: "Mapa clásico" })).toHaveAttribute("href", "/map")
})

test("el enlace directo a un lugar lo abre ya elegido", async ({ page }) => {
  await openCity(page, "/map/3d?place=biz-galeria-e2e")
  await expect(page.locator('[data-pin="biz-galeria-e2e"]')).toHaveAttribute("data-state", "selected")
  await expect(page.locator('[data-card="place"]').filter({ visible: true })).toContainText("Galería E2E")
})

test("en inglés la interfaz está traducida", async ({ page }) => {
  await openCity(page, "/en/map/3d")
  await expect(tab(page, "Explore")).toBeVisible()
  await expect(tab(page, "Neighborhoods")).toBeVisible()
})

test("la app enlaza al mapa 3D desde el mapa y desde cada ruta", async ({ page }, testInfo) => {
  test.skip(isMobile(testInfo), "mismos enlaces; basta con escritorio")
  await page.goto("/map")
  await expect(page.getByRole("link", { name: "Ver la ciudad en 3D" })).toHaveAttribute("href", "/map/3d")
  await page.goto("/routes/ruta-e2e")
  await expect(page.getByRole("link", { name: "Ver en 3D" })).toHaveAttribute("href", "/map/3d?route=ruta-e2e")
})
