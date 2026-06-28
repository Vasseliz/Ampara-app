import { test } from "@playwright/test";
import {
  createApiClient,
  getE2eEnv,
  novoPaciente,
  novoProfissional,
  obterToken,
  registrarUsuario,
  type RunContext,
} from "../../../foundation";
import { getWebRunContext } from "../../src/fixtures/run-context";
import { LoginPage } from "../../src/pages/login.page";
import { PacientesPage } from "../../src/pages/pacientes.page";
import { ConvitesPage } from "../../src/pages/convites.page";

test.describe.serial("Convites", () => {
  let ctx: RunContext;
  let invitedPatientEmail: string;
  let invitingProfessional: { email: string; senha: string; token: string };

  test.beforeAll(async () => {
    ctx = await getWebRunContext();
    const env = getE2eEnv();
    const api = createApiClient({ baseUrl: env.apiUrl });

    const invitedPatient = novoPaciente(`${ctx.runId}-convidado`);
    await registrarUsuario(api, invitedPatient);
    invitedPatientEmail = invitedPatient.email;

    const professional = novoProfissional(`${ctx.runId}-convite`);
    await registrarUsuario(api, professional);
    const { accessToken } = await obterToken(
      env.supabaseUrl,
      env.supabaseAnonKey,
      professional.email,
      professional.password,
    );
    invitingProfessional = {
      email: professional.email,
      senha: professional.password,
      token: accessToken,
    };
    await api.request("/patients/invite", {
      method: "POST",
      token: accessToken,
      body: { email: ctx.paciente.email },
    });
  });

  test("Profissional convida um paciente", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.profissional);
    const pacientes = new PacientesPage(page);
    await pacientes.open();
    await pacientes.invite(invitedPatientEmail);
  });

  test("Paciente lista convites recebidos", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.paciente);
    const convites = new ConvitesPage(page);
    await convites.open();
    await convites.expectPending(invitingProfessional.email);
  });

  test("Paciente aceita convite", async ({ page }) => {
    await new LoginPage(page).authenticate(ctx.paciente);
    const convites = new ConvitesPage(page);
    await convites.open();
    await convites.accept(invitingProfessional.email);
  });
});
