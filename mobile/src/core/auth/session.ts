import { secureStorage, type SecureStorage } from '../storage/secure';

/**
 * Guarda da sessão: access token em memória (nunca persistido), refresh token
 * em armazenamento seguro. Permite restaurar a sessão no boot e limpá-la no
 * logout. A storage é injetável para teste.
 */
export const REFRESH_TOKEN_KEY = 'ampara.session.refresh_token';

export interface SessionStore {
  getAccessToken(): string | null;
  setAccessToken(token: string | null): void;
  persistRefreshToken(token: string): Promise<void>;
  getRefreshToken(): Promise<string | null>;
  clear(): Promise<void>;
}

export function createSessionStore(storage: SecureStorage = secureStorage): SessionStore {
  let accessToken: string | null = null;

  return {
    getAccessToken: () => accessToken,
    setAccessToken: (token) => {
      accessToken = token;
    },
    persistRefreshToken: (token) => storage.setItem(REFRESH_TOKEN_KEY, token),
    getRefreshToken: () => storage.getItem(REFRESH_TOKEN_KEY),
    clear: async () => {
      accessToken = null;
      await storage.deleteItem(REFRESH_TOKEN_KEY);
    },
  };
}
