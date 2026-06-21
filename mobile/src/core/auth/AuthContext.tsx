import { createContext, useCallback, useEffect, useReducer, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient, authService, sessionStore } from '../api';
import { authReducer, initialAuthState, type AuthState } from './authMachine';
import { fetchProfile, type SessionTokens } from './authService';
import { onSessionExpired } from './events';

export interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : 'Falha na autenticação.';
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

  const register = useCallback(
    async (email: string, password: string) => {
      dispatch({ type: 'LOGIN_START' });
      try {
        const tokens = await authService.signUp({ email, password });
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
