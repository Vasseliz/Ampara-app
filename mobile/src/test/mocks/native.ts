/**
 * Fakes em memória dos módulos nativos, reutilizados nos testes. O registro
 * efetivo via `jest.mock` é feito em `jest.setup.ts`. Disponível para as tracks
 * (ex.: Track C precisa mockar LocalAuthentication).
 */

export function createInMemorySecureStore() {
  const store = new Map<string, string>();
  return {
    store,
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
}

/**
 * `level` mapeia o `getEnrolledLevelAsync` do Expo: 0 = nenhum, 1 = PIN/senha do
 * dispositivo, 2/3 = biometria. Default 3 (biometria forte).
 */
export function createLocalAuthenticationMock(success = true, level = 3) {
  return {
    hasHardwareAsync: jest.fn(async () => level >= 2),
    isEnrolledAsync: jest.fn(async () => level >= 2),
    getEnrolledLevelAsync: jest.fn(async () => level),
    authenticateAsync: jest.fn(async () => ({ success })),
  };
}
