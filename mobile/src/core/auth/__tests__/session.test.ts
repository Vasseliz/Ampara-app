import { createSessionStore, REFRESH_TOKEN_KEY } from '../session';
import type { SecureStorage } from '../../storage/secure';

function fakeStorage(): SecureStorage & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: async (k) => map.get(k) ?? null,
    setItem: async (k, v) => {
      map.set(k, v);
    },
    deleteItem: async (k) => {
      map.delete(k);
    },
  };
}

describe('createSessionStore', () => {
  it('mantém access token apenas em memória', () => {
    const storage = fakeStorage();
    const store = createSessionStore(storage);

    store.setAccessToken('access-123');

    expect(store.getAccessToken()).toBe('access-123');
    expect(storage.map.has(REFRESH_TOKEN_KEY)).toBe(false);
  });

  it('persiste e restaura o refresh token na storage segura', async () => {
    const storage = fakeStorage();
    const store = createSessionStore(storage);

    await store.persistRefreshToken('refresh-abc');

    expect(await store.getRefreshToken()).toBe('refresh-abc');
    expect(storage.map.get(REFRESH_TOKEN_KEY)).toBe('refresh-abc');
  });

  it('clear limpa memória e storage', async () => {
    const storage = fakeStorage();
    const store = createSessionStore(storage);
    store.setAccessToken('access-123');
    await store.persistRefreshToken('refresh-abc');

    await store.clear();

    expect(store.getAccessToken()).toBeNull();
    expect(await store.getRefreshToken()).toBeNull();
  });
});
