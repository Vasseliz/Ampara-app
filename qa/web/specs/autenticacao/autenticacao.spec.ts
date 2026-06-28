import { expect, test } from "@playwright/test";
import { type RunContext } from "../../../foundation";
import { getWebRunContext } from "../../src/fixtures/run-context";
import { LoginPage } from "../../src/pages/login.page";
import { SignupPage } from "../../src/pages/signup.page";

test.describe.serial("Autenticação", () => {
  let ctx: RunContext;

  test.beforeAll(async () => {
    ctx = await getWebRunContext();
  });

  test("Login com credenciais válidas", async ({ page }) => {
    await new LoginPage(page).loginSuccessfully(ctx.paciente);
  });

  test("Login com credenciais inválidas", async ({ page }) => {
    const login = new LoginPage(page);
    await login.login({ email: ctx.paciente.email, senha: `${ctx.paciente.senha}-incorreta` });
    await login.expectError();
  });

  test("Cadastro de conta de paciente", async ({ page }) => {
    const suffix = `${Date.now()}-${test.info().workerIndex}`;
    const account = {
      firstName: "Paciente",
      lastName: "E2E",
      email: `e2e.cadastro.${suffix}@ampara.test`,
      password: `Ampara@${Date.now()}9`,
    };
    await new SignupPage(page).registerPatient(account);
    await new LoginPage(page).loginSuccessfully({ email: account.email, senha: account.password });
  });

  test("Logout encerra a sessão", async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginSuccessfully(ctx.paciente);
    await login.logout();
  });

  test("Rota protegida redireciona sem sessão", async ({ page }) => {
    await page.goto("/cofre");
    await expect(page).toHaveURL(/\/login$/);
  });
});
