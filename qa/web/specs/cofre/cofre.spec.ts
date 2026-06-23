import { test } from "@playwright/test";
import { type RunContext } from "../../../foundation";
import { getWebRunContext } from "../../src/fixtures/run-context";
import { CofrePage } from "../../src/pages/cofre.page";
import { LoginPage } from "../../src/pages/login.page";

test.describe.serial("Cofre", () => {
  let ctx: RunContext;
  const content = `Nota privada E2E ${Date.now()}`;

  test.beforeAll(async () => {
    ctx = await getWebRunContext();
  });
  test.beforeEach(async ({ page }) => new LoginPage(page).authenticate(ctx.paciente));

  test("Paciente cria item no cofre", async ({ page }) => {
    const cofre = new CofrePage(page);
    await cofre.open();
    await cofre.create(content);
  });

  test("Paciente exclui item do cofre", async ({ page }) => {
    const cofre = new CofrePage(page);
    await cofre.open();
    await cofre.remove(content);
  });
});
