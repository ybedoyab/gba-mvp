import { expect, test, type Page, type TestInfo } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.removeItem("gba-redcoop-demo"));
  await page.reload();
});

async function login(page: Page, email = "laura.gomez@cooperativa.ejemplo") {
  await page.getByLabel("Correo").fill(email);
  const enter = page.getByRole("button", { name: "Iniciar sesión" });
  await enter.click();
  const hello = page.getByRole("heading", { name: /Hola,/ });
  try {
    await expect(hello).toBeVisible({ timeout: 15000 });
  } catch {
    if (await page.getByRole("heading", { name: "Iniciar sesión" }).isVisible()) await enter.click();
    await expect(hello).toBeVisible({ timeout: 20000 });
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

async function chooseTenant(page: Page, testInfo: TestInfo, value: string) {
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.getByLabel("Entidad de demostración", { exact: true }).selectOption(value);
    await page.keyboard.press("Escape");
  } else {
    await page.getByLabel("Cambiar entidad de demostración").selectOption(value);
  }
}

test("recorre la demo comercial y no deja errores de página", async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await login(page);
  await expect(page.getByRole("heading", { name: "Hola, Laura" })).toBeVisible({ timeout: 20000 });
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: `docs/qa-capturas/${testInfo.project.name}/dashboard.png`, fullPage: true });

  await page.goto("/app/transformacion");
  await expect(page.getByRole("heading", { name: "Mi Transformación" })).toBeVisible({ timeout: 20000 });
  await page.goto("/app/transformacion/programa");
  await expect(page.getByRole("heading", { name: "Seis módulos del acompañamiento" })).toBeVisible();
  await page.goto("/app/academy");
  await expect(page.getByRole("heading", { name: "Ruta SARLAFT para líderes de transformación" })).toBeVisible();
  await page.screenshot({ path: `docs/qa-capturas/${testInfo.project.name}/academy.png`, fullPage: true });
  await page.goto("/app/academy/leccion/gestion-del-riesgo");
  await expect(page.getByRole("heading", { name: "Gestión del riesgo en decisiones reales" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.goto("/app/reporteria");
  await page.getByLabel("Ver como").selectOption("gerencia");
  await expect(page.getByRole("heading", { name: "Lectura de la cooperativa" })).toBeVisible();
  await expect(page.getByText("Portal de asociados").first()).toBeVisible();
  await page.getByLabel("Ver como").selectOption("gba");
  await expect(page.getByRole("heading", { name: "Lectura de la red" })).toBeVisible();
  await expect(page.getByText("Cooperativa Horizonte").filter({ visible: true }).first()).toBeVisible();
  await page.getByLabel("Ver como").selectOption("participante");
  await expect(page.getByText("No acredita competencias.")).toBeVisible();
  await expect(page.locator(".recharts-bar-rectangle").first()).toBeVisible();
  await page.screenshot({ path: `docs/qa-capturas/${testInfo.project.name}/reporteria.png`, fullPage: true });

  await page.getByRole("button", { name: "Cuenta" }).click();
  await page.getByRole("menuitem", { name: "Modo presentación" }).click();
  await expect(page.getByText("Modo presentación · 90 s")).toBeVisible();
  await page.getByRole("button", { name: "Abrir GIO" }).click();
  await expect(page.getByText("Orientación para Ejemplo")).toBeVisible();
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("cambia la persona según el correo de la demo", async ({ page }) => {
  await login(page, "german.rojas@cooperativa.ejemplo");
  await expect(page.getByRole("heading", { name: "Hola, Germán" })).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: "Cuenta" }).click();
  await expect(page.getByText("Germán Rojas")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Cuenta" }).click();
  await page.getByRole("menuitem", { name: "Cerrar sesión" }).click();
  await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible();

  await login(page, "camila.herrera@gba.latam");
  await expect(page.getByRole("heading", { name: "Hola, Camila" })).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole("heading", { name: "Red Coop Central" })).toBeVisible();
});

test("no mezcla documentos, iniciativas ni cursos entre cooperativas", async ({ page }, testInfo) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Hola, Laura" })).toBeVisible({ timeout: 20000 });
  await page.goto("/app/transformacion/preoperativos");
  await expect(page.getByText("Acuerdo de tratamiento de datos del programa").filter({ visible: true })).toBeVisible();
  await chooseTenant(page, testInfo, "aurora");
  await expect(page.getByRole("heading", { name: "Documentos base" })).toBeVisible();
  await expect(page.getByText("Plan estratégico", { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(page.getByText("Acuerdo de tratamiento de datos del programa")).toHaveCount(0);
  await page.goto("/app/iniciativas");
  await expect(page.getByText("Oficina virtual de certificados")).toBeVisible();
  await expect(page.getByText("Portal de asociados")).toHaveCount(0);
  await page.goto("/app/academy");
  await expect(page.getByRole("heading", { name: "Orientación inicial del perfil" })).toBeVisible();
  await expect(page.getByText("Liderazgo de la transformación")).toBeVisible();
  await expect(page.getByText("Fundamentos de finanzas abiertas")).toHaveCount(0);
  await chooseTenant(page, testInfo, "ejemplo");
  await page.goto("/app/transformacion/preoperativos");
  await expect(page.getByText("Acuerdo de tratamiento de datos del programa").filter({ visible: true })).toBeVisible();
});

test("cargar un documento actualiza pendientes y sobrevive al reload", async ({ page }, testInfo) => {
  await login(page);
  await expect(page.getByText("hay 4 pendientes")).toBeVisible({ timeout: 20000 });
  await page.goto("/app/transformacion/preoperativos");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: /Acuerdo de tratamiento/ }).click();
  } else {
    await page.getByRole("row", { name: /Acuerdo de tratamiento/ }).getByRole("button", { name: "Ver" }).click();
  }
  await page.getByRole("button", { name: "Simular carga" }).click();
  await page.goto("/app");
  await expect(page.getByText("hay 3 pendientes")).toBeVisible();
  await page.reload();
  await expect(page.getByText("hay 3 pendientes")).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: "Cuenta" }).click();
  await page.getByRole("menuitem", { name: "Reiniciar demo" }).click();
  await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible();
  await login(page);
  await expect(page.getByText("hay 4 pendientes")).toBeVisible({ timeout: 20000 });
});

test("completar la lección no acredita la competencia", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Hola, Laura" })).toBeVisible({ timeout: 20000 });
  await page.goto("/app/academy/ruta");
  await page.getByRole("button", { name: /Validación/ }).click();
  await expect(page.getByText("Esta etapa sigue bloqueada")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ver proyecto de acreditación" })).toHaveCount(0);
  await page.goto("/app/academy/leccion/gestion-del-riesgo");
  await page.getByRole("button", { name: "Marcar como completada" }).click();
  await page.goto("/app/academy");
  const risk = page.getByRole("listitem").filter({ hasText: "Gestión del riesgo SARLAFT aplicada" });
  await expect(risk.getByText("Aplicación en curso")).toBeVisible();
  await expect(risk.getByText("Acreditada")).toHaveCount(0);
  const marco = page.getByRole("listitem").filter({ hasText: "Interpretación del marco SARLAFT" });
  await expect(marco.getByText("Acreditada por experto")).toBeVisible();
});

test("en móvil el recorrido principal no desborda", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Este caso cubre el viewport de 390 px.");
  await login(page);
  await expect(page.getByRole("heading", { name: "Hola, Laura" })).toBeVisible({ timeout: 20000 });
  for (const path of ["/app", "/app/transformacion", "/app/academy", "/app/reporteria", "/app/iniciativas"]) {
    await page.goto(path);
    await expectNoHorizontalOverflow(page);
  }
  await page.screenshot({ path: "docs/qa-capturas/mobile/navegacion.png", fullPage: true });
});
