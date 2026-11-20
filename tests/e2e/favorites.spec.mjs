// Favoritos sin cuenta: el corazón guarda en el teléfono, /favorites los muestra
// con la invitación a la cuenta, y al iniciar sesión pasan a la cuenta.
import { expect, test } from "@playwright/test"

const API = "http://127.0.0.1:4899"

test.beforeEach(async ({ request }) => {
  await request.get(`${API}/__reset`)
})

test("sin cuenta, el corazón guarda en el teléfono y /favorites lo muestra", async ({ page }) => {
  await page.goto("/businesses")
  const heart = page.getByRole("button", { name: "Agregar a favoritos" }).first()
  await heart.click()
  await expect(page.getByText("Guardado en este teléfono")).toBeVisible()
  await expect(page.getByRole("button", { name: "Quitar de favoritos" }).first()).toHaveAttribute("aria-pressed", "true")

  await page.goto("/favorites")
  await expect(page.getByRole("heading", { name: "Mis favoritos" })).toBeVisible()
  await expect(page.getByText(/se guardan en este teléfono/)).toBeVisible()
  await expect(page.getByRole("link", { name: "Iniciar sesión" }).last()).toHaveAttribute("href", /\/login\?next=%2Ffavorites/)
  await expect(page.getByRole("heading", { name: /E2E/ })).toHaveCount(1)
})

test("al iniciar sesión, los favoritos del teléfono pasan a la cuenta", async ({ page, context, request }) => {
  await page.goto("/businesses")
  await page.getByRole("button", { name: "Agregar a favoritos" }).first().click()
  await expect(page.getByText("Guardado en este teléfono")).toBeVisible()

  await context.addCookies([{ name: "user_token", value: "e2e-token", domain: "localhost", path: "/" }])
  await page.goto("/favorites")
  await expect(page.getByText(/a tu cuenta/)).toBeVisible({ timeout: 20_000 })
  await expect
    .poll(async () => (await (await request.get(`${API}/__state`)).json()).favorites.length, { timeout: 15_000 })
    .toBe(1)
  // el teléfono queda limpio y la página muestra el favorito de la cuenta
  expect(await page.evaluate(() => localStorage.getItem("cartagena-viva:favorites"))).toBe("[]")
})

test("logros sin cuenta explican qué son en vez de mandar al login", async ({ page }) => {
  await page.goto("/achievements")
  await expect(page).toHaveURL(/\/achievements$/)
  await expect(page.getByRole("heading", { name: "Empieza a sumar logros" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Iniciar sesión" }).last()).toHaveAttribute("href", /next=%2Fachievements/)
})
