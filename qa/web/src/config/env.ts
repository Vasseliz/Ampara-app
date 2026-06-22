import path from "node:path";

// Perfis de autenticação do Ampara.
export type AuthProfile = "paciente" | "profissional";

type CredentialPair = { email?: string; password?: string };

// base = front web (Vite); api = backend .NET (fonte da verdade para seed).
export type AppUrls = { base: string; api: string };

export type AppEnv = {
  homolog: string;
  headless: boolean;
  workers: number;
  urls: AppUrls;
  credentials: Record<string, CredentialPair>;
  database: {
    host: string; port: number; user: string; password: string; database: string;
  };
  timeouts: { test: number; expect: number; action: number; navigation: number };
  paths: { workspaceRoot: string; storageStateDir: string; downloadsDir: string };
};

const workspaceRoot = path.resolve(__dirname, "..", "..");

function toBoolean(v: string | undefined, fb: boolean) {
  return v ? v.toLowerCase() !== "false" : fb;
}
function toNumber(v: string | undefined, fb: number) {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isNaN(n) ? fb : n;
}

let cachedEnv: AppEnv | undefined;

export function getAppEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  cachedEnv = {
    homolog: process.env.PW_HOMOLOG ?? "dev",
    headless: toBoolean(process.env.PW_HEADLESS, true),
    workers: toNumber(process.env.PW_WORKERS, 4),
    urls: {
      base: process.env.PW_BASE_URL ?? "http://localhost:5173/",
      api: process.env.PW_API_URL ?? "http://localhost:5243",
    },
    credentials: {
      paciente: {
        email: process.env.PW_PACIENTE_EMAIL,
        password: process.env.PW_PACIENTE_PASSWORD,
      },
      profissional: {
        email: process.env.PW_PROFISSIONAL_EMAIL,
        password: process.env.PW_PROFISSIONAL_PASSWORD,
      },
    },
    database: {
      host: process.env.PW_DB_HOST ?? "",
      port: toNumber(process.env.PW_DB_PORT, 0),
      user: process.env.PW_DB_USER ?? "",
      password: process.env.PW_DB_PASSWORD ?? "",
      database: process.env.PW_DB_DATABASE ?? "",
    },
    timeouts: {
      test: toNumber(process.env.PW_TEST_TIMEOUT, 90000),
      expect: toNumber(process.env.PW_EXPECT_TIMEOUT, 15000),
      action: toNumber(process.env.PW_ACTION_TIMEOUT, 15000),
      navigation: toNumber(process.env.PW_NAVIGATION_TIMEOUT, 45000),
    },
    paths: {
      workspaceRoot,
      storageStateDir: path.resolve(workspaceRoot, ".auth"),
      downloadsDir: path.resolve(workspaceRoot, "downloads"),
    },
  };
  return cachedEnv;
}

export function resetAppEnvCache(): void {
  cachedEnv = undefined;
}

export function getProfileCredentials(profile: string): { email: string; password: string } {
  const c = getAppEnv().credentials[profile];
  if (!c?.email || !c?.password) {
    throw new Error(`Credenciais ausentes para o perfil '${profile}'. Preencha PW_* no .env.local.`);
  }
  return { email: c.email, password: c.password };
}

export function getStorageStatePath(profile: string, workerIndex: number): string {
  return path.resolve(getAppEnv().paths.storageStateDir, `${profile}-${workerIndex}.json`);
}
