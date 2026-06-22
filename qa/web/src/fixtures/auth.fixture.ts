import fs from "node:fs";
import path from "node:path";
import { type Browser, type Page, test as base } from "@playwright/test";
import {
  getAppEnv,
  getStorageStatePath,
  type AppEnv,
  type AuthProfile,
} from "../config/env";
import { AuthFlow } from "../flows";
import { loginByProfile, resolveLocator } from "../config/auth.config";
import { ensureDirectory } from "../utils/file-helpers";

type SharedFixtures = {
  authenticatedPage: Page;
};

type WorkerFixtures = {
  env: AppEnv;
  workerStorageState: string;
};

const STORAGE_LOCK_TIMEOUT_MS = 180000;
const STORAGE_LOCK_POLL_MS = 1000;

type StorageLockMetadata = {
  pid?: number;
  createdAt?: number;
  storagePath?: string;
};

function readStorageLockMetadata(lockPath: string): StorageLockMetadata | null {
  try {
    const content = fs.readFileSync(lockPath, "utf8").trim();
    if (!content) return null;
    return JSON.parse(content) as StorageLockMetadata;
  } catch {
    return null;
  }
}

function isProcessAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

function getStorageLockAgeMs(lockPath: string): number {
  const metadata = readStorageLockMetadata(lockPath);
  if (typeof metadata?.createdAt === "number") {
    return Date.now() - metadata.createdAt;
  }
  try {
    return Date.now() - fs.statSync(lockPath).mtimeMs;
  } catch {
    return 0;
  }
}

function isStaleStorageLock(lockPath: string): boolean {
  if (!fs.existsSync(lockPath)) return false;
  const metadata = readStorageLockMetadata(lockPath);
  if (typeof metadata?.pid === "number" && !isProcessAlive(metadata.pid)) {
    return true;
  }
  return getStorageLockAgeMs(lockPath) > STORAGE_LOCK_TIMEOUT_MS;
}

function clearStaleStorageLock(lockPath: string): boolean {
  if (!isStaleStorageLock(lockPath)) return false;
  fs.rmSync(lockPath, { force: true });
  return true;
}

async function authenticateForProfile(
  browser: Browser,
  env: AppEnv,
  profile: AuthProfile,
  storagePath: string,
): Promise<void> {
  const page = await browser.newPage({
    storageState: undefined,
    ignoreHTTPSErrors: true,
  });
  const authFlow = new AuthFlow(page, env);

  await authFlow.authenticateProfile(profile);
  await ensureDirectory(path.dirname(storagePath));
  await page.context().storageState({ path: storagePath });
  await page.close();
}

async function waitForStorageLock(lockPath: string): Promise<void> {
  const startedAt = Date.now();

  while (fs.existsSync(lockPath)) {
    if (clearStaleStorageLock(lockPath)) return;
    if (Date.now() - startedAt > STORAGE_LOCK_TIMEOUT_MS) {
      throw new Error(`Timeout ao aguardar lock de autenticacao: ${lockPath}`);
    }
    await new Promise((resolve) => setTimeout(resolve, STORAGE_LOCK_POLL_MS));
  }
}

async function withStorageLock<T>(
  storagePath: string,
  action: () => Promise<T>,
): Promise<T> {
  const lockPath = `${storagePath}.lock`;
  const startedAt = Date.now();

  while (true) {
    let handle: number | undefined;

    try {
      handle = fs.openSync(lockPath, "wx");
      fs.writeFileSync(
        lockPath,
        JSON.stringify({
          pid: process.pid,
          createdAt: Date.now(),
          storagePath,
        } satisfies StorageLockMetadata),
      );
      break;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "EEXIST") throw error;
      if (clearStaleStorageLock(lockPath)) continue;
      if (Date.now() - startedAt > STORAGE_LOCK_TIMEOUT_MS) {
        throw new Error(`Timeout ao adquirir lock de autenticacao: ${lockPath}`);
      }
      await waitForStorageLock(lockPath);
    } finally {
      if (handle !== undefined) fs.closeSync(handle);
    }
  }

  try {
    return await action();
  } finally {
    fs.rmSync(lockPath, { force: true });
  }
}


async function hasVisibleLogin(page: Page, profile: AuthProfile): Promise<boolean> {
  const login = loginByProfile[profile];
  if (!login) return false;
  const indicators = login.loginIndicators ?? login.fields.map((f) => f.locator);

  for (const spec of indicators) {
    const locator = resolveLocator(page, spec).first();
    if ((await locator.count()) === 0) continue;
    if (await locator.isVisible().catch(() => false)) return true;
  }
  return false;
}

async function hasValidSession(
  browser: Browser,
  env: AppEnv,
  profile: AuthProfile,
  storagePath: string,
): Promise<boolean> {
  const page = await browser.newPage({
    storageState: storagePath,
    ignoreHTTPSErrors: true,
  });

  try {
    await page.goto(env.urls.base).catch(() => undefined);
    await page.waitForLoadState("networkidle").catch(() => undefined);
    return !(await hasVisibleLogin(page, profile));
  } catch {
    return false;
  } finally {
    await page.close().catch(() => undefined);
  }
}

export async function ensureAuthenticatedStorageState(
  browser: Browser,
  env: AppEnv,
  profile: AuthProfile,
  workerIndex: number,
): Promise<string> {
  const storagePath = getStorageStatePath(profile, workerIndex);
  await ensureDirectory(path.dirname(storagePath));

  await withStorageLock(storagePath, async () => {
    const storageExists = fs.existsSync(storagePath);
    const isValid = storageExists
      ? await hasValidSession(browser, env, profile, storagePath)
      : false;

    if (!storageExists || !isValid) {
      if (storageExists) fs.rmSync(storagePath, { force: true });
      await authenticateForProfile(browser, env, profile, storagePath);
    }
  });

  return storagePath;
}

function buildAuthenticatedTest(profile: AuthProfile) {
  return base.extend<SharedFixtures, WorkerFixtures>({
    env: [
      async ({}, use) => {
        await use(getAppEnv());
      },
      { scope: "worker" },
    ],

    storageState: ({ workerStorageState }, use) => use(workerStorageState),

    workerStorageState: [
      async ({ browser, env }, use, workerInfo) => {
        const storagePath = await ensureAuthenticatedStorageState(
          browser,
          env,
          profile,
          workerInfo.workerIndex,
        );
        await use(storagePath);
      },
      { scope: "worker" },
    ],

    authenticatedPage: async ({ page }, use) => {
      await use(page);
    },
  });
}

// Perfis do Ampara.
export const pacienteTest = buildAuthenticatedTest("paciente");
export const profissionalTest = buildAuthenticatedTest("profissional");
export const test = pacienteTest;
export { expect } from "@playwright/test";
