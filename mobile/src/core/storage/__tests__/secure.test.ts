import { createSecureStorage, type SecureStorage } from '../secure';

function createFakeAdapter(): SecureStorage & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    getItem: jest.fn(async (key: string) => store.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItem: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
}

describe('createSecureStorage', () => {
  it('delega setItem/getItem ao adapter injetado', async () => {
    const adapter = createFakeAdapter();
    const storage = createSecureStorage(adapter);

    await storage.setItem('token', 'abc');
    const value = await storage.getItem('token');

    expect(adapter.setItem).toHaveBeenCalledWith('token', 'abc');
    expect(value).toBe('abc');
  });

  it('delega deleteItem ao adapter injetado', async () => {
    const adapter = createFakeAdapter();
    const storage = createSecureStorage(adapter);

    await storage.setItem('token', 'abc');
    await storage.deleteItem('token');

    expect(adapter.deleteItem).toHaveBeenCalledWith('token');
    expect(await storage.getItem('token')).toBeNull();
  });
});
