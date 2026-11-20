// Inicio "qué hacer hoy": abierto ahora (con reloj fijo), rutas, la semana,
// la franja del 3D y salidas del hero; también en inglés.
import { expect, test } from "@playwright/test"

// jueves 19 de noviembre de 2026, 15:30 en Cartagena
const THURSDAY_AFTERNOON = new Date("2026-11-19T15:30:00-05:00")

async function openHome(page, path = "/") {
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  await page.clock.setFixedTime(THURSDAY_AFTERNOON)
  await page.goto(path)
  await expect(page.locator("h1")).toBeVisible()
  return errors
}

test("el hero lleva a lo que existe hoy", async ({ page }) => {
  const errors = await openHome(page)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Qué hacer hoy en Cartagena")
  await expect(page.getByRole("main").getByRole("link", { name: "Ver qué está abierto", exact: true })).toHaveAttribute("href", "/map#mapa")
  await expect(page.getByRole("main").getByRole("link", { name: "Ciudad en 3D", exact: true })).toHaveAttribute("href", "/map/3d")
  // las promesas que no existían ya no están
  await expect(page.getByText("Realidad Aumentada")).toHaveCount(0)
  await expect(page.getByText("Próximamente")).toHaveCount(0)
  expect(errors).toEqual([])
})

test("abierto ahora muestra los negocios abiertos a esta hora", async ({ page }) => {
  await openHome(page)
  const section = page.locator("section", { has: page.getByRole("heading", { name: "Abierto ahora" }) })
  await expect(section.getByText("Son las 15:30 en Cartagena.")).toBeVisible()
  await expect(section.getByRole("link", { name: /Café E2E/ })).toContainText("Abierto · cierra 18:00")
  await expect(section.getByRole("link", { name: /Galería E2E/ })).toContainText("Abierto · cierra 19:00")
})

test("rutas a pie y la semana enlazan a su detalle", async ({ page }) => {
  await openHome(page)
  const routes = page.locator("section", { has: page.getByRole("heading", { name: "Rutas a pie" }) })
  await expect(routes.getByRole("link", { name: /Ruta E2E/ }).first()).toHaveAttribute("href", "/routes/ruta-e2e")
  await expect(routes.getByRole("link", { name: "En 3D" }).first()).toHaveAttribute("href", "/map/3d?route=ruta-e2e")

  const week = page.locator("section", { has: page.getByRole("heading", { name: "Esta semana" }) })
  await expect(week.getByRole("link", { name: /Festival E2E/ })).toHaveAttribute("href", "/events/festival-e2e")
  await expect(week.getByRole("link", { name: /Cine al aire libre E2E/ })).toContainText("Gratis")
  await expect(week.getByRole("link", { name: /Noche de salsa E2E/ })).toContainText("$50.000 COP")
})

test("la franja del 3D lleva al mapa 3D", async ({ page }) => {
  await openHome(page)
  await expect(page.getByRole("link", { name: "Abrir la ciudad en 3D" })).toHaveAttribute("href", "/map/3d")
})

test("en inglés el inicio está traducido", async ({ page }) => {
  await openHome(page, "/en")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("What to do in Cartagena today")
  await expect(page.getByRole("heading", { name: "Open now" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Walking routes" })).toBeVisible()
})

test("la historia muestra los cuatro hitos y cada uno lleva a su capítulo", async ({ page }) => {
  await openHome(page)
  const section = page.locator("section", { has: page.getByRole("heading", { name: "Cinco siglos en cuatro fechas" }) })
  const milestones = section.locator("ol > li")
  await expect(milestones).toHaveCount(4)
  await expect(milestones.first().getByRole("link")).toHaveAttribute("href", "/history#hito-founding")
  await expect(section.getByRole("link", { name: "Leer la historia completa" })).toHaveAttribute("href", "/history")
  // ya no hay carrusel con flechas
  await expect(section.getByRole("button")).toHaveCount(0)
})
