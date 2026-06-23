import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  limparRun,
  seedParVinculado,
  type RunContext,
} from "../../../foundation";

const markerPath = path.resolve(process.cwd(), ".tmp", "web-e2e-run-id");

export async function setupWebRunContext(): Promise<void> {
  await teardownWebRunContext();
  const context = await seedParVinculado();
  await writeFile(markerPath, context.runId, "utf8");
}

export async function getWebRunContext(): Promise<RunContext> {
  const runId = (await readFile(markerPath, "utf8")).trim();
  if (!runId) throw new Error("Contexto global E2E não foi inicializado.");

  const { lerContext } = await import("../../../foundation");
  return lerContext(runId);
}

export async function teardownWebRunContext(): Promise<void> {
  let runId: string;
  try {
    runId = (await readFile(markerPath, "utf8")).trim();
  } catch {
    return;
  }

  try {
    if (runId) await limparRun(runId);
  } finally {
    await rm(markerPath, { force: true });
  }
}
