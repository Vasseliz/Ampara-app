import fs from "node:fs/promises";
import path from "node:path";
import type { Download } from "@playwright/test";
import { getAppEnv } from "../config/env";
import { runStep } from "./steps";

export async function ensureDirectory(directoryPath: string): Promise<void> {
  await fs.mkdir(directoryPath, { recursive: true });
}

export function resolveWorkspacePath(...segments: string[]): string {
  return path.resolve(getAppEnv().paths.workspaceRoot, ...segments);
}

/** Resolve um arquivo de fixture para upload (imagens de exemplo em src/fixtures). */
export function resolveUploadFixture(fileName: string): string {
  return resolveWorkspacePath("src", "fixtures", fileName);
}

export async function saveDownload(download: Download, relativeDirectory = "downloads"): Promise<string> {
  return runStep(`Salvar download em ${relativeDirectory}`, async () => {
    const targetDirectory = resolveWorkspacePath(relativeDirectory);
    await ensureDirectory(targetDirectory);

    const suggestedFileName = download.suggestedFilename();
    const targetPath = path.resolve(targetDirectory, suggestedFileName);

    await download.saveAs(targetPath);
    return targetPath;
  });
}
