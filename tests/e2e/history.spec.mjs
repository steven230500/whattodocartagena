// /history como capítulos: seis hitos con ancla, índice que lleva a cada uno y
// marca el que se está leyendo, y enlaces a la ciudad 3D donde corresponde.
import { expect, test } from "@playwright/test"

test("los seis capítulos se leen sin tarjetas y el índice lleva a cada uno", async ({ page }) => {
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  await page.goto("/history")
  await expect(page.locator("article[id^='hito-']")).toHaveCount(6)
  const index = page.getByRole("navigation", { name: "Capítulos de la historia" })
  await expect(index.getByRole("link")).toHaveCount(6)

  await index.getByRole("link", { name: /1811/ }).click()
  await expect(page).toHaveURL(/#hito-independence$/)
  await expect(page.locator("#hito-independence")).toBeInViewport()
  await expect(index.locator('a[aria-current="location"]')).toContainText("1811")
  expect(errors).toEqual([])
})

test("el sitio de 1741 lleva al Castillo San Felipe en la ciudad 3D", async ({ page }) => {
  await page.goto("/history#hito-siege1741")
  await expect(page.locator("#hito-siege1741").getByRole("link", { name: "Verlo en la ciudad 3D" })).toHaveAttribute(
    "href",
    "/map/3d?place=poi-castillo-san-felipe",
  )
  // las fotos dicen que son de hoy
  await expect(page.locator("#hito-siege1741 figcaption")).toContainText("hoy")
})

test("en inglés la historia está traducida", async ({ page }) => {
  await page.goto("/en/history")
  await expect(page.getByRole("heading", { name: "Six moments that made Cartagena" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Independence: the Heroic City" })).toBeVisible()
})
