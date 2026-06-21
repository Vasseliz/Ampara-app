import dotenv from "dotenv";
import path from "node:path";

// Carrega .env e .env.local (override) a partir da raiz do pacote qa/.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

export type E2eEnv = {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey?: string;
};

const REQUIRED = ["E2E_API_URL", "E2E_SUPABASE_URL", "E2E_SUPABASE_ANON_KEY"] as const;

export function readE2eEnv(source: Record<string, string | undefined>): E2eEnv {
  const missing = REQUIRED.filter((k) => !source[k]?.trim());
  if (missing.length) {
    throw new Error(`Variáveis de ambiente E2E ausentes: ${missing.join(", ")}`);
  }
  return {
    apiUrl: source.E2E_API_URL!.trim().replace(/\/$/, ""),
    supabaseUrl: source.E2E_SUPABASE_URL!.trim().replace(/\/$/, ""),
    supabaseAnonKey: source.E2E_SUPABASE_ANON_KEY!.trim(),
    supabaseServiceRoleKey: source.E2E_SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined,
  };
}

let cached: E2eEnv | undefined;

/** Singleton lido de process.env. Só consumido por auth/seed/cleanup (integração). */
export function getE2eEnv(): E2eEnv {
  if (!cached) cached = readE2eEnv(process.env as Record<string, string | undefined>);
  return cached;
}
