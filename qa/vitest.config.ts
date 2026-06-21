import { defineConfig } from "vitest/config";

// Vitest cobre a Fundação (seed) e o contrato BDD. O Playwright cobre os .spec.ts
// de UI em ./testes. São runners separados, com globs separados.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/seed/**/*.test.ts", "features/**/*.test.ts"],
    setupFiles: ["src/seed/test-setup.ts"],
  },
});
