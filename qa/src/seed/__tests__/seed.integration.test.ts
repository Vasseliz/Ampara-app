import { describe, it, expect } from "vitest";
import { seedParVinculado } from "../seed";
import { lerContext } from "../context";

const temBackend = !!process.env.E2E_API_URL && !!process.env.E2E_SUPABASE_URL;

describe.skipIf(!temBackend)("seed (integração)", () => {
  it("cria par vinculado, grava o context e devolve tokens válidos", async () => {
    const ctx = await seedParVinculado("it-seed");
    expect(ctx.profissionalId).toBeTruthy();
    expect(ctx.pacienteId).toBeTruthy();
    expect(ctx.conviteId).toBeTruthy();
    expect(ctx.deepLink).toContain(ctx.conviteId!);
    expect(ctx.profissional.token).toBeTruthy();
    expect(ctx.paciente.token).toBeTruthy();

    const lido = await lerContext(ctx.runId);
    expect(lido.pacienteId).toBe(ctx.pacienteId);
  });
});
