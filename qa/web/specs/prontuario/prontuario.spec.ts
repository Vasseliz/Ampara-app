import { test } from "@playwright/test";
import { type RunContext } from "../../../foundation";
import { getWebRunContext } from "../../src/fixtures/run-context";
import { LoginPage } from "../../src/pages/login.page";
import { ProntuarioPage } from "../../src/pages/prontuario.page";

test.describe.serial("Prontuário", () => {
  let ctx: RunContext;
  const original = `Nota clínica E2E ${Date.now()}`;
  const updated = `${original} atualizada`;

  test.beforeAll(async () => {
    ctx = await getWebRunContext();
  });
  test.beforeEach(async ({ page }) => new LoginPage(page).authenticate(ctx.profissional));

  test("Acesso ao prontuário", async ({ page }) => {
    const prontuario = new ProntuarioPage(page);
    await prontuario.open(ctx.pacienteId);
    await prontuario.expectPatientSelected(ctx.pacienteId);
  });

  test("CRUD de notas", async ({ page }) => {
    const prontuario = new ProntuarioPage(page);
    await prontuario.open(ctx.pacienteId);
    await prontuario.createNote(original);
    await prontuario.editNote(original, updated);
    await prontuario.deleteNote(updated);
  });

  test("Filtros de pacientes", async ({ page }) => {
    const prontuario = new ProntuarioPage(page);
    await prontuario.open();
    await prontuario.filterPatient(ctx.pacienteId);
    await prontuario.expectPatientSelected(ctx.pacienteId);
  });
});
