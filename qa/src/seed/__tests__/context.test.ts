import { describe, it, expect, afterEach } from "vitest";
import { rm } from "node:fs/promises";
import { escreverContext, lerContext, caminhoContext, type RunContext } from "../context";

const ctx: RunContext = {
  runId: "test-run",
  profissional: { email: "pro@x", senha: "p", token: "tpro" },
  paciente: { email: "pac@x", senha: "p", token: "tpac" },
  profissionalId: "id-pro",
  pacienteId: "id-pac",
  conviteId: "id-conv",
  deepLink: "ampara://convites/id-conv",
};

afterEach(async () => {
  await rm(caminhoContext("test-run"), { force: true });
});

describe("context", () => {
  it("escreve e relê o mesmo contexto (roundtrip)", async () => {
    const p = await escreverContext(ctx);
    expect(p).toBe(caminhoContext("test-run"));
    expect(await lerContext("test-run")).toEqual(ctx);
  });
});
