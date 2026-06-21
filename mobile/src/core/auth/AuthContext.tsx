import { createContext, useCallback, useEffect, useReducer, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError, apiClient, authService, sessionStore } from '../api';
import { authReducer, initialAuthState, type AuthState } from './authMachine';
import { fetchProfile, registerAccount, type SessionTokens } from './authService';
import { onSessionExpired } from './events';

/** Dados do cadastro de paciente coletados na tela. */
export interface RegisterPatientInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterPatientInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : 'Falha na autenticação.';
}

/** "E-mail já cadastrado" para 409; mensagem genérica para o resto. */
function registerErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.kind === 'conflict') return 'E-mail já cadastrado.';
  return messageOf(error);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const queryClient = useQueryClient();

  const applyTokens = useCallback(async (tokens: SessionTokens) => {
    sessionStore.setAccessToken(tokens.accessToken);
    await sessionStore.persistRefreshToken(tokens.refreshToken);
  }, []);

  // Bootstrap: tenta restaurar a sessão a partir do refresh token persistido.
  useEffect(() => {
    let active = true;
    (async () => {
      const refreshToken = await sessionStore.getRefreshToken();
      if (!refreshToken) {
        if (active) dispatch({ type: 'BOOTSTRAP_EMPTY' });
        return;
      }
      const tokens = await authService.refresh(refreshToken);
      if (!tokens) {
        await sessionStore.clear();
        if (active) dispatch({ type: 'BOOTSTRAP_EMPTY' });
        return;
      }
      await applyTokens(tokens);
      try {
        const user = await fetchProfile(apiClient);
        if (active) dispatch({ type: 'BOOTSTRAP_RESTORED', user });
      } catch {
        await sessionStore.clear();
        if (active) dispatch({ type: 'BOOTSTRAP_EMPTY' });
      }
    })();
    return () => {
      active = false;
    };
  }, [applyTokens]);

  // Sessão expirada (refresh falhou na camada de rede) → encerra a sessão.
  useEffect(
    () =>
      onSessionExpired(() => {
        void sessionStore.clear();
        queryClient.clear();
        dispatch({ type: 'LOGOUT' });
      }),
    [queryClient],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch({ type: 'LOGIN_START' });
      try {
        const tokens = await authService.signIn(email, password);
        await applyTokens(tokens);
        const user = await fetchProfile(apiClient);
        dispatch({ type: 'LOGIN_SUCCESS', user });
      } catch (error) {
        await sessionStore.clear();
        dispatch({ type: 'LOGIN_ERROR', error: messageOf(error) });
      }
    },
    [applyTokens],
  );

  // Cadastra pelo backend (cria perfil local, como o web) e então autentica.
  // Não usa `authService.signUp` direto no Supabase — era a origem do `403`.
  const register = useCallback(
    async ({ firstName, lastName, email, password }: RegisterPatientInput) => {
      const normalizedEmail = email.trim();
      dispatch({ type: 'LOGIN_START' });
      try {
        await registerAccount(apiClient, {
          role: 'patient',
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          password,
          registrationId: null,
        });
      } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: registerErrorMessage(error) });
        return;
      }
      await login(normalizedEmail, password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    await authService.signOut().catch(() => undefined);
    await sessionStore.clear();
    queryClient.clear();
    dispatch({ type: 'LOGOUT' });
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
