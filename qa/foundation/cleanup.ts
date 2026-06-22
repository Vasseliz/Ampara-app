import { rm } from "node:fs/promises";
import { getE2eEnv } from "./config";
import { createApiClient, ApiError } from "./apiClient";
import { caminhoContext, lerContext, type RunContext } from "./context";

/**
 * Destrói o estado de um run. Idempotente: rodar duas vezes não lança.
 *
 * Nota honesta: a .NET API não expõe endpoint de deletar usuário. Sem
 * E2E_SUPABASE_SERVICE_ROLE_KEY, os usuários permanecem — inofensivos porque os
 * e-mails têm runId único. Com a service key, deletamos via admin API do Supabase.
 */
export async function limparRun(runId: string): Promise<void> {
  let ctx: RunContext | null = null;
  try {
    ctx = await lerContext(runId);
  } catch {
    return; // sem context => nada a limpar (idempotente)
  }

  const env = getE2eEnv();
  const api = createApiClient({ baseUrl: env.apiUrl });

  // 1. dados de domínio best-effort. Tolera 4xx: o convite pode já estar aceito
  //    (vira vínculo → DELETE responde 400) ou já apagado (404). Em ambos não há
  //    o que limpar — seguimos.
  if (ctx.conviteId) {
    await ignorarErroCliente(() =>
      api.request(`/patients/invites/${ctx!.conviteId}`, {
        method: "DELETE",
        token: ctx!.profissional.token,
      }),
    );
  }

  // 2. usuários no Supabase, apenas se houver service role key.
  if (env.supabaseServiceRoleKey) {
    await deletarUsuario(env.supabaseUrl, env.supabaseServiceRoleKey, ctx.profissionalId);
    await deletarUsuario(env.supabaseUrl, env.supabaseServiceRoleKey, ctx.pacienteId);
  }

  // 3. arquivo de context.
  await rm(caminhoContext(runId), { force: true });
}

async function deletarUsuario(supabaseUrl: string, serviceKey: string, id: string): Promise<void> {
  await fetch(`${supabaseUrl}/auth/v1/admin/users/${id}`, {
    method: "DELETE",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
}

async function ignorarErroCliente(fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
  } catch (e) {
    // Limpeza best-effort: erros de cliente (4xx) significam "não há o que apagar".
    if (e instanceof ApiError && e.status >= 400 && e.status < 500) return;
    throw e;
  }
}
