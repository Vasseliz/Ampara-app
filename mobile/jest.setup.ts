/* Setup global de testes: variáveis de ambiente e mocks de módulos nativos. */

process.env.EXPO_PUBLIC_API_URL ||= 'http://localhost:5243';
process.env.EXPO_PUBLIC_SUPABASE_URL ||= 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key';

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});
