import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Credencial = { email: string; senha: string; token: string };

export type RunContext = {
  runId: string;
  profissional: Credencial;
  paciente: Credencial;
  profissionalId: string;
  pacienteId: string;
  conviteId: string | null;
  deepLink: string | null;
};

// .tmp na raiz do pacote qa/. Todos os runners (vitest, playwright, tsx) sobem com
// cwd = qa/, então process.cwd() resolve de forma consistente.
const TMP_DIR = path.resolve(process.cwd(), ".tmp");

export function caminhoContext(runId: string): string {
  return path.join(TMP_DIR, `context.${runId}.json`);
}

export async function escreverContext(ctx: RunContext): Promise<string> {
  await mkdir(TMP_DIR, { recursive: true });
  const p = caminhoContext(ctx.runId);
  await writeFile(p, JSON.stringify(ctx, null, 2), "utf8");
  return p;
}

export async function lerContext(runId: string): Promise<RunContext> {
  return JSON.parse(await readFile(caminhoContext(runId), "utf8")) as RunContext;
}
