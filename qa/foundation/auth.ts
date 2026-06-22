import type { ApiClient } from "./apiClient";
import type { NovoUsuario } from "./personas";

/** Cria a conta via .NET API (`POST /auth/register`). */
export async function registrarUsuario(api: ApiClient, u: NovoUsuario): Promise<void> {
  await api.request("/auth/register", {
    method: "POST",
    body: {
      role: u.role,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      password: u.password,
      registrationId: u.registrationId,
    },
  });
}

/**
 * Obtém tokens via Supabase password grant (o `/auth/login` da .NET só devolve
 * cookie; o app usa Bearer, então autenticamos direto no Supabase).
 */
export async function obterToken(
  supabaseUrl: string,
  anonKey: string,
  email: string,
  senha: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: senha }),
  });
  if (!res.ok) {
    throw new Error(`Supabase token grant falhou: HTTP ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; refresh_token: string };
  return { accessToken: data.access_token, refreshToken: data.refresh_token };
}

/** Resolve id/papel do usuário autenticado (`GET /auth/me` com Bearer). */
export async function obterIdUsuario(
  api: ApiClient,
  token: string,
): Promise<{ id: string; role: string }> {
  return api.request<{ id: string; role: string }>("/auth/me", { token });
}
