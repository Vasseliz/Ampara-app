import { faker } from "@faker-js/faker";
import { randomBytes } from "node:crypto";

export type NovoUsuario = {
  role: "patient" | "professional";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  registrationId: string | null;
};

export function gerarRunId(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
  return `${stamp}-${randomBytes(3).toString("hex")}`;
}

function email(runId: string, prefixo: string): string {
  const sufixo = randomBytes(3).toString("hex");
  return `e2e+${prefixo}-${runId}-${sufixo}@ampara.test`;
}

function base(runId: string, role: NovoUsuario["role"], prefixo: string): NovoUsuario {
  return {
    role,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: email(runId, prefixo),
    password: `E2e!${faker.string.alphanumeric(10)}`,
    registrationId: null,
  };
}

export function novoProfissional(runId: string): NovoUsuario {
  return {
    ...base(runId, "professional", "pro"),
    registrationId: `CRP-${faker.string.numeric(6)}`,
  };
}

export function novoPaciente(runId: string): NovoUsuario {
  return base(runId, "patient", "pac");
}
