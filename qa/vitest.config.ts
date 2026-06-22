import { defineConfig } from "vitest/config";

// Vitest cobre a Fundação (foundation/) e o contrato BDD (features/). O Playwright
// cobre os .spec.ts de UI em web/specs. São runners separados, com globs separados.
export default defineConfig({
  test: {
    environment: "node",
    include: ["foundation/**/*.test.ts", "features/**/*.test.ts"],
    setupFiles: ["foundation/test-setup.ts"],
  },
});
