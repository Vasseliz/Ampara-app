import { test } from "@playwright/test";
import { type RunContext } from "../../../foundation";
import { getWebRunContext } from "../../src/fixtures/run-context";
import { LoginPage } from "../../src/pages/login.page";
import { MedicamentosPage } from "../../src/pages/medicamentos.page";

test.describe.serial("Medicamentos do paciente", () => {
  let ctx: RunContext;
  const name = `Sertralina E2E ${Date.now()}`;

  test.beforeAll(async () => {
    ctx = await getWebRunContext();
  });

  test("Profissional prescreve medicamento", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.profissional);
    const medicamentos = new MedicamentosPage(page);
    await medicamentos.openProfessional(ctx.pacienteId);
    await medicamentos.create(name, "50mg");
  });

  test("Profissional edita medicamento", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.profissional);
    const medicamentos = new MedicamentosPage(page);
    await medicamentos.openProfessional(ctx.pacienteId);
    await medicamentos.edit(name, "75mg");
  });

  test("Paciente marca a tomada", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.paciente);
    const medicamentos = new MedicamentosPage(page);
    await medicamentos.openPatient();
    await medicamentos.expectPatientMedication(name);
    await medicamentos.markTaken(name);
  });

  test("Profissional exclui medicamento", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.profissional);
    const medicamentos = new MedicamentosPage(page);
    await medicamentos.openProfessional(ctx.pacienteId);
    await medicamentos.deactivate(name);
  });
});
