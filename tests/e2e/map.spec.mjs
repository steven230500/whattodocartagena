// Mapa clásico (/map): lugares de la app sobre Leaflet, filtros, "abierto ahora"
// con reloj fijo, "cerca de mí" con ubicación simulada y enlaces al 3D.
import { expect, test } from "@playwright/test"

// lunes 16 de noviembre de 2026, 12:00 en Cartagena
const MONDAY_NOON = new Date("2026-11-16T12:00:00-05:00")
const isMobile = (testInfo) => testInfo.project.name === "mobile"

async function openMap(page) {
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  await page.clock.setFixedTime(MONDAY_NOON)
  await page.goto("/map")
  await expect(page.locator("[data-map-pin]").first()).toBeAttached({ timeout: 60_000 })
  return errors
}

const items = (page) => page.locator("[data-place-item]")

test("muestra los lugares curados y los negocios, sin duplicados ni errores", async ({ page }) => {
  const errors = await openMap(page)
  await expect(items(page)).toHaveCount(8)
  await expect(page.locator("[data-map-pin]")).toHaveCount(8)
  await expect(page.locator("[data-result-count]")).toHaveText("8 lugares")
  // el bloque de estadísticas y las leyendas duplicadas ya no existen
  await expect(page.getByText("Estadísticas")).toHaveCount(0)
  expect(errors).toEqual([])
})

test("cada negocio usa su tipo real y muestra si está abierto", async ({ page }) => {
  await openMap(page)
  const cafe = page.locator('[data-place-item="biz-cafe-e2e"]')
  await expect(cafe).toContainText("Comer")
  await expect(cafe).toContainText("Abierto · cierra 18:00")
  const galeria = page.locator('[data-place-item="biz-galeria-e2e"]')
  await expect(galeria).toContainText("Cultura")
  await expect(galeria).toContainText("Cerrado por hoy")
})

test("filtros: tipo, barrio, abierto ahora y búsqueda; y limpiar", async ({ page }) => {
  await openMap(page)
  await page.locator('[data-filter-kind="culture"]').click()
  await expect(page.locator('[data-filter-kind="culture"]')).toHaveAttribute("aria-pressed", "false")
  await expect(items(page)).toHaveCount(5)
  await page.getByRole("button", { name: "Limpiar filtros" }).first().click()
  await expect(items(page)).toHaveCount(8)

  await page.locator("[data-barrio-select]").selectOption("Getsemaní")
  await expect(items(page)).toHaveCount(2)
  await page.locator("[data-barrio-select]").selectOption("")

  await page.locator("[data-open-now]").click()
  await expect(items(page)).toHaveCount(1)
  await expect(items(page).first()).toContainText("Café E2E")
  await page.locator("[data-open-now]").click()

  await page.locator("[data-place-search]").fill("museo")
  await expect(items(page)).toHaveCount(1)
  await page.locator("[data-place-search]").fill("zzzz")
  await expect(items(page)).toHaveCount(0)
  await expect(page.getByText("Ningún lugar coincide con estos filtros.")).toBeVisible()
  await page.getByRole("button", { name: "Limpiar filtros" }).first().click()
  await expect(items(page)).toHaveCount(8)
  await expect(page.locator('[data-map-pin]')).toHaveCount(8)
})

test("elegir un lugar marca su pin y abre la tarjeta con sus salidas", async ({ page }) => {
  await openMap(page)
  await page.locator('[data-place-item="biz-galeria-e2e"]').click()
  await expect(page.locator('[data-map-pin="biz-galeria-e2e"]')).toHaveAttribute("data-state", "selected")
  const card = page.locator('[data-place-card="biz-galeria-e2e"]')
  await expect(card).toBeVisible()
  await expect(card).toContainText("Galería E2E")
  await expect(card.getByRole("link", { name: "Cómo llegar" })).toHaveAttribute(
    "href",
    "https://www.google.com/maps/dir/?api=1&destination=10.4207,-75.5458",
  )
  await expect(card.getByRole("link", { name: "En 3D" })).toHaveAttribute("href", "/map/3d?place=biz-galeria-e2e")
  await expect(card.getByRole("link", { name: /Ver detalles/ })).toHaveAttribute("href", "/businesses/galeria-e2e")

  await card.getByRole("button", { name: "Cerrar" }).click()
  await expect(card).toHaveCount(0)
  await expect(page.locator('[data-map-pin="biz-galeria-e2e"]')).toHaveAttribute("data-state", "idle")
})

test("tocar un pin en el mapa también lo elige", async ({ page }) => {
  await openMap(page)
  await page.locator('[data-map-pin="poi-torre-del-reloj"]').click()
  await expect(page.locator('[data-place-card="poi-torre-del-reloj"]')).toContainText("Torre del Reloj")
  await expect(page.locator('[data-place-item="poi-torre-del-reloj"]')).toHaveAttribute("aria-pressed", "true")
})

test("cerca de mí ordena por distancia", async ({ page, context }) => {
  await context.grantPermissions(["geolocation"])
  await context.setGeolocation({ latitude: 10.4207, longitude: -75.5458 })
  await openMap(page)
  await page.locator("[data-near-me]").click()
  await expect(page.locator("[data-near-me]")).toHaveAttribute("aria-pressed", "true")
  await expect(items(page).first()).toHaveAttribute("data-place-item", "biz-galeria-e2e")
  await expect(items(page).first()).toContainText("0 m")
  await expect(page.locator("[data-user-location]")).toBeAttached()
})

test("sin permiso de ubicación avisa en vez de fallar en silencio", async ({ page }) => {
  await openMap(page)
  await page.locator("[data-near-me]").click()
  await expect(page.getByText("No pudimos obtener tu ubicación")).toBeVisible()
})

test("el hero lleva al 3D y al mapa", async ({ page }, testInfo) => {
  await openMap(page)
  await expect(page.getByRole("link", { name: "Ver la ciudad en 3D" })).toHaveAttribute("href", "/map/3d")
  await page.getByRole("link", { name: "Ir al mapa" }).click()
  await expect(page.locator("#mapa")).toBeInViewport()
  if (isMobile(testInfo)) await expect(page.locator("[data-map-pin]").first()).toBeAttached()
})

test("en inglés la página está traducida", async ({ page }) => {
  await page.clock.setFixedTime(MONDAY_NOON)
  await page.goto("/en/map")
  await expect(page.getByRole("heading", { name: "Map of Cartagena" })).toBeVisible()
  await expect(page.locator('[data-place-item="biz-cafe-e2e"]')).toContainText("Open · closes 18:00")
  await expect(page.locator("[data-result-count]")).toHaveText("8 places")
})
