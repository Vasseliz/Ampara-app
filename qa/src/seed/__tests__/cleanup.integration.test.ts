import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { seedParVinculado } from "../seed";
import { limparRun } from "../cleanup";
import { caminhoContext } from "../context";

const temBackend = !!process.env.E2E_API_URL && !!process.env.E2E_SUPABASE_URL;

describe.skipIf(!temBackend)("cleanup (integração)", () => {
  it("remove o arquivo de context e é idempotente", async () => {
    const ctx = await seedParVinculado("it-clean");
    expect(existsSync(caminhoContext(ctx.runId))).toBe(true);

    await limparRun(ctx.runId);
    expect(existsSync(caminhoContext(ctx.runId))).toBe(false);

    // segunda chamada não lança (idempotente)
    await expect(limparRun(ctx.runId)).resolves.toBeUndefined();
  });
});
