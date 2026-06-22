import { describe, it, expect } from "vitest";
import { novoProfissional, novoPaciente, gerarRunId } from "../personas";

describe("personas", () => {
  it("gera profissional com role e registrationId", () => {
    const p = novoProfissional("run1");
    expect(p.role).toBe("professional");
    expect(p.email).toContain("run1");
    expect(p.registrationId).not.toBeNull();
    expect(p.password.length).toBeGreaterThanOrEqual(8);
  });

  it("gera paciente sem registrationId", () => {
    const p = novoPaciente("run1");
    expect(p.role).toBe("patient");
    expect(p.registrationId).toBeNull();
    expect(p.email).toContain("run1");
  });

  it("e-mails são únicos entre chamadas no mesmo run", () => {
    expect(novoPaciente("run1").email).not.toBe(novoPaciente("run1").email);
  });

  it("gerarRunId casa o formato esperado", () => {
    expect(gerarRunId()).toMatch(/^\d{8}-\d{4}-[0-9a-f]{6}$/);
  });
});
