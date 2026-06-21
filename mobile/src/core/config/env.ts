/**
 * Leitura tipada das variáveis públicas do Expo (`EXPO_PUBLIC_*`).
 *
 * Apenas chaves públicas entram aqui — segredos de servidor nunca devem ir para
 * o bundle. As variáveis são inlined pelo Expo em build time a partir de
 * `process.env.EXPO_PUBLIC_*`; por isso a leitura é feita acessando as chaves
 * diretamente (e não dinamicamente), para o bundler conseguir substituí-las.
 */

export type AppEnv = {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export type EnvSource = Record<string, string | undefined>;

const REQUIRED_KEYS = [
  'EXPO_PUBLIC_API_URL',
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
] as const;

/**
 * Valida e tipa as variáveis de ambiente. Lança erro descritivo se faltar
 * qualquer obrigatória. Recebe a fonte por parâmetro para ser testável.
 */
export function readEnv(source: EnvSource): AppEnv {
  const missing = REQUIRED_KEYS.filter((key) => {
    const value = source[key];
    return value === undefined || value.trim() === '';
  });

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}. ` +
        'Defina-as em mobile/.env (veja .env.example).',
    );
  }

  return {
    apiUrl: source.EXPO_PUBLIC_API_URL!.trim(),
    supabaseUrl: source.EXPO_PUBLIC_SUPABASE_URL!.trim(),
    supabaseAnonKey: source.EXPO_PUBLIC_SUPABASE_ANON_KEY!.trim(),
  };
}

// Acesso direto para permitir o inlining do Expo em build time.
const rawEnv: EnvSource = {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
};

export const env: AppEnv = readEnv(rawEnv);
