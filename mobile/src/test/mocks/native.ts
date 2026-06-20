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

export function createLocalAuthenticationMock(success = true) {
  return {
    hasHardwareAsync: jest.fn(async () => true),
    isEnrolledAsync: jest.fn(async () => true),
    authenticateAsync: jest.fn(async () => ({ success })),
  };
}
