import { env } from '../config/env';
import { createSessionStore } from '../auth/session';
import { createSupabaseAuthService } from '../auth/authService';
import { supabase } from '../auth/supabase';
import { emitSessionExpired } from '../auth/events';
import { createApiClient } from './client';

/**
 * Composição dos singletons da camada de rede/sessão. As features importam
 * `apiClient` daqui; auth e refresh já estão integrados.
 */
export const sessionStore = createSessionStore();
export const authService = createSupabaseAuthService(supabase);

export const apiClient = createApiClient({
  baseUrl: env.apiUrl,
  getAccessToken: () => sessionStore.getAccessToken(),
  refresh: async () => {
    const refreshToken = await sessionStore.getRefreshToken();
    if (!refreshToken) return null;

    const tokens = await authService.refresh(refreshToken);
    if (!tokens) return null;

    sessionStore.setAccessToken(tokens.accessToken);
    await sessionStore.persistRefreshToken(tokens.refreshToken);
    return tokens.accessToken;
  },
  onLogout: () => emitSessionExpired(),
});

export { createApiClient } from './client';
export * from './errors';
