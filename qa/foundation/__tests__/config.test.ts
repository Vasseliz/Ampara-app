import { describe, it, expect } from "vitest";
import { readE2eEnv } from "../config";

describe("readE2eEnv", () => {
  it("lê as três chaves obrigatórias", () => {
    const env = readE2eEnv({
      E2E_API_URL: "http://localhost:5243",
      E2E_SUPABASE_URL: "https://x.supabase.co",
      E2E_SUPABASE_ANON_KEY: "anon",
    });
    expect(env.apiUrl).toBe("http://localhost:5243");
    expect(env.supabaseUrl).toBe("https://x.supabase.co");
    expect(env.supabaseAnonKey).toBe("anon");
    expect(env.supabaseServiceRoleKey).toBeUndefined();
  });

  it("lança erro listando as chaves ausentes", () => {
    expect(() => readE2eEnv({ E2E_API_URL: "x" })).toThrow(/E2E_SUPABASE_URL/);
  });

  it("captura a service role key quando presente", () => {
    const env = readE2eEnv({
      E2E_API_URL: "a",
      E2E_SUPABASE_URL: "b",
      E2E_SUPABASE_ANON_KEY: "c",
      E2E_SUPABASE_SERVICE_ROLE_KEY: "svc",
    });
    expect(env.supabaseServiceRoleKey).toBe("svc");
  });
});
