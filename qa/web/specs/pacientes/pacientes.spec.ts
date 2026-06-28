import { test } from "@playwright/test";
import { type RunContext } from "../../../foundation";
import { getWebRunContext } from "../../src/fixtures/run-context";
import { LoginPage } from "../../src/pages/login.page";
import { PacientesPage } from "../../src/pages/pacientes.page";

test.describe.serial("Pacientes", () => {
  let ctx: RunContext;

  test.beforeAll(async () => {
    ctx = await getWebRunContext();
  });
  test.beforeEach(async ({ page }) => new LoginPage(page).authenticate(ctx.profissional));

  test("Listar pacientes", async ({ page }) => {
    const pacientes = new PacientesPage(page);
    await pacientes.open();
    await pacientes.expectPatient(ctx.paciente.email);
  });

  test("Visão geral do paciente", async ({ page }) => {
    const pacientes = new PacientesPage(page);
    await pacientes.open();
    await pacientes.openOverview(ctx.paciente.email);
  });

  test("Ver e editar informações clínicas", async ({ page }) => {
    const pacientes = new PacientesPage(page);
    await pacientes.open();
    await pacientes.openOverview(ctx.paciente.email);
    await pacientes.editClinicalInfo(`Diagnóstico E2E ${ctx.runId}`);
  });
});
