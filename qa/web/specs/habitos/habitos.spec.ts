import { test } from "@playwright/test";
import { type RunContext } from "../../../foundation";
import { getWebRunContext } from "../../src/fixtures/run-context";
import { HabitosPage } from "../../src/pages/habitos.page";
import { LoginPage } from "../../src/pages/login.page";

test.describe.serial("Hábitos", () => {
  let ctx: RunContext;

  test.beforeAll(async () => {
    ctx = await getWebRunContext();
  });
  test.beforeEach(async ({ page }) => new LoginPage(page).authenticate(ctx.paciente));

  test("Paciente marca um hábito do dia", async ({ page }) => {
    const habitos = new HabitosPage(page);
    await habitos.open();
    await habitos.markExercise();
  });

  test("Paciente desmarca um hábito", async ({ page }) => {
    const habitos = new HabitosPage(page);
    await habitos.open();
    await habitos.markExercise();
    await habitos.unmarkExercise();
  });

  test("Paciente vê o histórico de hábitos", async ({ page }) => {
    const habitos = new HabitosPage(page);
    await habitos.open();
    await habitos.submit();
  });
});
