// Detalle de ruta: camino por calles reales, distancia y tiempo a pie, y salida a Google Maps.
import { expect, test } from "@playwright/test"

const params = (href) => new URL(href).searchParams

test("el mapa de la ruta sigue las calles y muestra distancia y tiempo a pie", async ({ page }, testInfo) => {
  await page.goto("/routes/ruta-e2e")
  const map = page.locator("[data-route-map]")
  await expect(map.locator(".route-street-path")).toHaveCount(1)
  await expect(map.locator("[data-walk-summary]")).toHaveText(/^\d+([.,]\d)? k?m · \d+ min a pie$/)
  await expect(map.getByText("Por calles, pasando por las 3 paradas en orden")).toBeVisible()

  // el panel cabe en pantalla y no hay scroll horizontal (celular)
  const link = map.getByRole("link", { name: /Ruta completa en Google Maps/ })
  const box = await link.boundingBox()
  const width = page.viewportSize().width
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(width)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

  await map.screenshot({ path: testInfo.outputPath("route-map.png") })
})

test("ruta completa en Google Maps: a pie, de la primera parada a la última pasando por las demás", async ({ page }) => {
  await page.goto("/routes/ruta-e2e")
  const link = page.getByRole("link", { name: /Ruta completa en Google Maps/ })
  await expect(link).toHaveAttribute("target", "_blank")
  const p = params(await link.getAttribute("href"))
  expect(p.get("origin")).toBe("10.42302,-75.54921")
  expect(p.get("waypoints")).toBe("10.42435,-75.55198")
  expect(p.get("destination")).toBe("10.42371,-75.55066")
  expect(p.get("travelmode")).toBe("walking")
})

test("cada parada se puede abrir en Google Maps y el enlace sigue a la parada actual", async ({ page }) => {
  await page.goto("/routes/ruta-e2e")
  const stop = page.getByRole("link", { name: /Ver esta parada en Google Maps/ })
  await expect(stop).toHaveAttribute("href", /query=10\.42302%2C-75\.54921$/)
  await page.getByRole("button", { name: "Siguiente parada" }).click()
  await expect(stop).toHaveAttribute("href", /query=10\.42435%2C-75\.55198$/)
})

test("en inglés", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "mismos textos; basta con escritorio")
  await page.goto("/en/routes/ruta-e2e")
  await expect(page.getByRole("link", { name: /Full route in Google Maps/ })).toBeVisible()
  await expect(page.locator("[data-walk-summary]")).toHaveText(/min walk$/)
  await expect(page.getByRole("link", { name: /See this stop in Google Maps/ })).toBeVisible()
})
