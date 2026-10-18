import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.removeItem("gba-redcoop-demo"));
  await page.reload();
});

test("recorre login, planeación, academy y reportería", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible();
  const enter = page.getByRole("button", { name: "Iniciar sesión" });
  await enter.click();
  const hello = page.getByRole("heading", { name: "Hola, Laura" });
  try {
    await expect(hello).toBeVisible({ timeout: 15000 });
  } catch {
    if (await page.getByRole("heading", { name: "Iniciar sesión" }).isVisible()) await enter.click();
    await expect(hello).toBeVisible({ timeout: 20000 });
  }
  await expect(page.getByRole("button", { name: "Planeación", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Pendientes/ })).toBeVisible();

  await page.goto("/app/transformacion");
  await expect(page.getByRole("heading", { name: "Mi Transformación" })).toBeVisible({ timeout: 20000 });
  await page.getByRole("link", { name: /Preoperativos/ }).first().click();
  await expect(page.getByRole("heading", { name: "Documentos base" })).toBeVisible();

  await page.goto("/app/academy");
  await expect(page.getByRole("heading", { name: "Ruta SARLAFT para líderes de transformación" })).toBeVisible();
  await page.goto("/app/academy/leccion/gestion-del-riesgo");
  await expect(page.getByRole("heading", { name: "Gestión del riesgo en decisiones reales" })).toBeVisible();

  await page.goto("/app/reporteria");
  await page.getByLabel("Ver como").selectOption("gerencia");
  await expect(page.getByRole("heading", { name: "Lectura de la cooperativa" })).toBeVisible();
  await page.getByLabel("Ver como").selectOption("participante");
  await expect(page.getByRole("heading", { name: "Mi avance" })).toBeVisible();
});

test("en móvil no aparece scroll horizontal y el menú abre secciones", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "El menú hamburguesa solo está en pantallas pequeñas.");
  await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible();
  const enter = page.getByRole("button", { name: "Iniciar sesión" });
  await enter.click();
  const hello = page.getByRole("heading", { name: "Hola, Laura" });
  try {
    await expect(hello).toBeVisible({ timeout: 15000 });
  } catch {
    if (await page.getByRole("heading", { name: "Iniciar sesión" }).isVisible()) await enter.click();
    await expect(hello).toBeVisible({ timeout: 20000 });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await expect(page.getByRole("link", { name: "Preoperativos" })).toBeVisible();
});
