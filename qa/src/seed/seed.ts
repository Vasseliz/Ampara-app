import { getE2eEnv } from "./config";
import { createApiClient, type ApiClient } from "./apiClient";
import { gerarRunId, novoPaciente, novoProfissional } from "./personas";
import { obterIdUsuario, obterToken, registrarUsuario } from "./auth";
import { escreverContext, type Credencial, type RunContext } from "./context";

/**
 * Cria um par profissional↔paciente vinculado na .NET API, autentica os dois,
 * grava o context.<runId>.json e o devolve. É a peça que torna o "contexto
 * compartilhado" (web↔app) possível: web escreve estado, app lê — via este seed.
 */
export async function seedParVinculado(runId: string = gerarRunId()): Promise<RunContext> {
  const env = getE2eEnv();
  const api = createApiClient({ baseUrl: env.apiUrl });

  const pro = novoProfissional(runId);
  const pac = novoPaciente(runId);

  await registrarUsuario(api, pro);
  await registrarUsuario(api, pac);

  const proCred = await autenticar(api, pro.email, pro.password);
  const pacCred = await autenticar(api, pac.email, pac.password);

  // Profissional convida o paciente por e-mail.
  const convite = await api.request<{ id: string }>("/patients/invite", {
    method: "POST",
    token: proCred.token,
    body: { email: pac.email },
  });

  // Paciente aceita o convite por id.
  await api.request(`/patients/invites/${convite.id}/accept`, {
    method: "POST",
    token: pacCred.token,
  });

  const proMe = await obterIdUsuario(api, proCred.token);
  const pacMe = await obterIdUsuario(api, pacCred.token);

  const ctx: RunContext = {
    runId,
    profissional: proCred,
    paciente: pacCred,
    profissionalId: proMe.id,
    pacienteId: pacMe.id,
    conviteId: convite.id,
    deepLink: `ampara://convites/${convite.id}`,
  };

  await escreverContext(ctx);
  return ctx;
}

async function autenticar(_api: ApiClient, email: string, senha: string): Promise<Credencial> {
  const env = getE2eEnv();
  const { accessToken } = await obterToken(env.supabaseUrl, env.supabaseAnonKey, email, senha);
  return { email, senha, token: accessToken };
}
