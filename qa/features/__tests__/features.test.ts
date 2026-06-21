import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// As features ficam em qa/features; os runners sobem com cwd = qa/.
const FEATURES_DIR = path.resolve(process.cwd(), "features");

describe("contrato de features", () => {
  const arquivos = readdirSync(FEATURES_DIR).filter((f) => f.endsWith(".feature"));

  it("tem os 10 arquivos de feature esperados", () => {
    expect(arquivos.length).toBe(10);
  });

  it('todo .feature declara "Funcionalidade:" e ao menos um "Cenário:"', () => {
    for (const f of arquivos) {
      const txt = readFileSync(path.join(FEATURES_DIR, f), "utf8");
      expect(txt, f).toMatch(/Funcionalidade:/);
      expect(txt, f).toMatch(/Cenário:/);
    }
  });

  it("cross-platform.feature marca cenários com @cross", () => {
    const txt = readFileSync(path.join(FEATURES_DIR, "cross-platform.feature"), "utf8");
    expect((txt.match(/@cross/g) ?? []).length).toBeGreaterThanOrEqual(4);
  });
});
