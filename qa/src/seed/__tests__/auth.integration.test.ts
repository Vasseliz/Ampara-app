import { describe, it, expect } from "vitest";
import { createApiClient } from "../apiClient";
import { novoPaciente } from "../personas";
import { registrarUsuario, obterToken, obterIdUsuario } from "../auth";

const temBackend = !!process.env.E2E_API_URL && !!process.env.E2E_SUPABASE_URL;

describe.skipIf(!temBackend)("auth (integração)", () => {
  const api = createApiClient({ baseUrl: process.env.E2E_API_URL! });

  it("registra, autentica e resolve o id do usuário", async () => {
    const u = novoPaciente("it-auth");
    await registrarUsuario(api, u);

    const { accessToken } = await obterToken(
      process.env.E2E_SUPABASE_URL!,
      process.env.E2E_SUPABASE_ANON_KEY!,
      u.email,
      u.password,
    );
    expect(accessToken).toBeTruthy();

    const me = await obterIdUsuario(api, accessToken);
    expect(me.id).toBeTruthy();
    expect(me.role).toBe("patient");
  });
});
