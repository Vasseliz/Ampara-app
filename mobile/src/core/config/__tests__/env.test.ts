import { readEnv } from '../env';

const validSource = {
  EXPO_PUBLIC_API_URL: 'http://localhost:5243',
  EXPO_PUBLIC_SUPABASE_URL: 'https://x.supabase.co',
  EXPO_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
};

describe('readEnv', () => {
  it('retorna objeto tipado quando todas as variáveis estão presentes', () => {
    expect(readEnv(validSource)).toEqual({
      apiUrl: 'http://localhost:5243',
      supabaseUrl: 'https://x.supabase.co',
      supabaseAnonKey: 'anon-key',
    });
  });

  it('lança erro descritivo quando falta variável obrigatória', () => {
    const { EXPO_PUBLIC_SUPABASE_URL, ...incomplete } = validSource;
    expect(() => readEnv(incomplete)).toThrow(/EXPO_PUBLIC_SUPABASE_URL/);
  });

  it('trata string vazia como ausente', () => {
    expect(() => readEnv({ ...validSource, EXPO_PUBLIC_API_URL: '   ' })).toThrow(
      /EXPO_PUBLIC_API_URL/,
    );
  });
});
