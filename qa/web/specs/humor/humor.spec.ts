import { test } from "@playwright/test";
import { type RunContext } from "../../../foundation";
import { getWebRunContext } from "../../src/fixtures/run-context";
import { LoginPage } from "../../src/pages/login.page";
import { HumorPage } from "../../src/pages/humor.page";

test.describe.serial("Humor", () => {
  let ctx: RunContext;
  const note = `Humor E2E ${Date.now()}`;

  test.beforeAll(async () => {
    ctx = await getWebRunContext();
  });

  test("Paciente registra o humor do dia", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.paciente);
    const humor = new HumorPage(page);
    await humor.openPatient();
    await humor.register(8, note);
  });

  test("Paciente vê o histórico de humor", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.paciente);
    const humor = new HumorPage(page);
    await humor.openPatient();
    await humor.expectHistory();
  });

  test("Profissional acompanha o humor do paciente", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.profissional);
    await new HumorPage(page).openProfessional(ctx.pacienteId);
  });
});
