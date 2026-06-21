import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiClient } from '../api/client';
import type { AuthRole, AuthUser } from './authMachine';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpInput {
  email: string;
  password: string;
}

/**
 * Porta de autenticação. A implementação padrão usa Supabase, mas a interface
 * permite injetar um fake em teste sem depender do SDK.
 */
export interface AuthService {
  signIn(email: string, password: string): Promise<SessionTokens>;
  signUp(input: SignUpInput): Promise<SessionTokens>;
  signOut(): Promise<void>;
  /** Restaura/renova a sessão a partir do refresh token. null = falhou. */
  refresh(refreshToken: string): Promise<SessionTokens | null>;
}

type SupabaseSession = { access_token?: string; refresh_token?: string } | null;

function toTokens(session: SupabaseSession): SessionTokens | null {
  if (!session?.access_token || !session?.refresh_token) return null;
  return { accessToken: session.access_token, refreshToken: session.refresh_token };
}

export function createSupabaseAuthService(client: SupabaseClient): AuthService {
  return {
    async signIn(email, password) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const tokens = toTokens(data.session);
      if (!tokens) throw new Error('Sessão Supabase ausente após login.');
      return tokens;
    },
    async signUp({ email, password }) {
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) throw error;
      const tokens = toTokens(data.session);
      if (!tokens) {
        throw new Error('Cadastro criado, mas pode exigir confirmação de e-mail.');
      }
      return tokens;
    },
    async signOut() {
      await client.auth.signOut();
    },
    async refresh(refreshToken) {
      const { data, error } = await client.auth.refreshSession({ refresh_token: refreshToken });
      if (error) return null;
      return toTokens(data.session);
    },
  };
}

export interface RegisterInput {
  role: AuthRole;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  registrationId: string | null;
}

/**
 * Cria a conta no backend (`POST /auth/register`), que cadastra o usuário externo
 * **e** o perfil local na mesma operação — mesmo caminho do web. Evita o `403`
 * (`SemPerfilLocal`) que ocorria ao cadastrar direto no Supabase sem perfil local.
 */
export async function registerAccount(client: ApiClient, input: RegisterInput): Promise<void> {
  await client.request('/auth/register', { method: 'POST', body: input });
}

/** Resolve id e papel do usuário via API atual (`GET /auth/me`). */
export async function fetchProfile(client: ApiClient): Promise<AuthUser> {
  const me = await client.request<{
    id: string;
    role?: string;
    tipo?: string;
    papel?: string;
  }>('/auth/me');
  return { id: me.id, role: normalizeRole(me.role ?? me.tipo ?? me.papel) };
}

function normalizeRole(value?: string): AuthRole {
  return (value ?? '').toLowerCase().startsWith('prof') ? 'professional' : 'patient';
}
