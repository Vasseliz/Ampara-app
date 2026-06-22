import { test } from "@playwright/test";

export async function runStep<T>(title: string, action: () => Promise<T>): Promise<T> {
  return test.step(title, action);
}
