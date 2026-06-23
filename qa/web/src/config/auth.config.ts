import type { Locator, Page } from "@playwright/test";

/**
 * Configuração DECLARATIVA de login por perfil.
 *
 * Adaptar a um novo app = preencher os seletores aqui. A lógica do fluxo
 * (`src/flows/auth.flow.ts`) e a máquina de sessão (`src/fixtures/auth.fixture.ts`)
 * NÃO mudam. Logins complexos (multi-etapa, SSO, captcha) podem sobrescrever
 * `AuthFlow.authenticateProfile` em vez de usar esta config.
 */

// Descritor de locator na ordem do repositório:
// data-cy (getByTestId) → role/label → texto → css.
export type LocatorSpec =
  | { testId: string }
  | { role: string; name?: string | RegExp }
  | { label: string | RegExp }
  | { text: string | RegExp }
  | { css: string };

export interface LoginField {
  locator: LocatorSpec;
  /** Qual credencial do perfil preencher (vem de getProfileCredentials). */
  value: "email" | "password";
}

export interface ProfileLogin {
  /** URL da tela de login. Default: getAppEnv().urls.base. Relativa ou absoluta. */
  loginUrl?: string;
  /** Campos a preencher, em ordem. */
  fields: LoginField[];
  /** Botão/ação que submete o login. */
  submit: LocatorSpec;
  /** Elemento que comprova login bem-sucedido (aguardado visível). */
  success: LocatorSpec;
  /**
   * Elementos que indicam que AINDA estamos na tela de login (sessão inválida).
   * Default: os próprios campos de login. Usado por `hasVisibleLogin`.
   */
  loginIndicators?: LocatorSpec[];
}

/**
 * Um bloco por perfil. O fluxo (`auth.flow.ts`) aborta com mensagem clara se algum
 * seletor ainda contiver o placeholder `TODO` — protege contra login mal configurado.
 */
// NOTA: o front web do Ampara quase não tem `data-cy` hoje (Track A vai adicioná-los).
// Por isso o login usa seletores por id/role. `success` aponta para o <main> do
// DashboardLayout (renderizado só após autenticar) — QA-1 deve confirmar/refinar.
// Paciente e profissional usam o MESMO formulário de login; o roteamento por papel
// é resolvido pelo app após o submit.
const loginCompartilhado: ProfileLogin = {
  loginUrl: "/login",
  fields: [
    { locator: { css: "#email" }, value: "email" },
    { locator: { css: "#password" }, value: "password" },
  ],
  submit: { role: "button", name: /entrar/i },
  success: { testId: "app-shell" },
  loginIndicators: [{ css: "#password" }],
};

export const loginByProfile: Record<string, ProfileLogin> = {
  paciente: loginCompartilhado,
  profissional: loginCompartilhado,
};

/** Resolve um LocatorSpec contra a página (ou um escopo). */
export function resolveLocator(scope: Page, spec: LocatorSpec): Locator {
  if ("testId" in spec) return scope.getByTestId(spec.testId);
  if ("role" in spec) {
    const role = spec.role as Parameters<Page["getByRole"]>[0];
    return scope.getByRole(role, spec.name ? { name: spec.name } : undefined);
  }
  if ("label" in spec) return scope.getByLabel(spec.label);
  if ("text" in spec) return scope.getByText(spec.text);
  return scope.locator(spec.css);
}

/** Retorna o primeiro seletor ainda com placeholder `TODO`, se houver. */
export function findUnconfiguredSelector(login: ProfileLogin): string | null {
  const specs: LocatorSpec[] = [
    ...login.fields.map((f) => f.locator),
    login.submit,
    login.success,
    ...(login.loginIndicators ?? []),
  ];
  for (const spec of specs) {
    for (const value of Object.values(spec)) {
      if (typeof value === "string" && value.includes("TODO")) return value;
    }
  }
  return null;
}
