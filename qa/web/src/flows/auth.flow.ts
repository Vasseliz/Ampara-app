import { type Page } from "@playwright/test";
import {
  getAppEnv,
  getProfileCredentials,
  type AppEnv,
  type AuthProfile,
} from "../config/env";
import {
  loginByProfile,
  resolveLocator,
  findUnconfiguredSelector,
} from "../config/auth.config";

/**
 * Fluxo de autenticação genérico, dirigido por `src/config/auth.config.ts`.
 *
 * Para adaptar: preencha os seletores em `auth.config.ts` (não edite este arquivo).
 * Logins complexos (multi-etapa, SSO, captcha) podem sobrescrever
 * `authenticateProfile` numa subclasse ou ajustar este método diretamente.
 */
export class AuthFlow {
  constructor(
    private readonly page: Page,
    private readonly appEnv?: AppEnv,
  ) {}

  private resolveEnv(): AppEnv {
    return this.appEnv ?? getAppEnv();
  }

  async authenticateProfile(profile: AuthProfile): Promise<void> {
    const env = this.resolveEnv();

    const login = loginByProfile[profile];
    if (!login) {
      throw new Error(
        `Perfil de login '${profile}' não configurado. ` +
          `Adicione um bloco em src/config/auth.config.ts.`,
      );
    }

    const pendente = findUnconfiguredSelector(login);
    if (pendente) {
      throw new Error(
        `Login do perfil '${profile}' ainda não adaptado: seletor placeholder ` +
          `'${pendente}' em src/config/auth.config.ts. Substitua pelos seletores reais do seu app.`,
      );
    }

    const credentials = getProfileCredentials(profile);
    const url = login.loginUrl
      ? new URL(login.loginUrl, env.urls.base).toString()
      : env.urls.base;

    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: env.timeouts.navigation,
    });

    for (const field of login.fields) {
      await resolveLocator(this.page, field.locator).fill(credentials[field.value]);
    }

    await resolveLocator(this.page, login.submit).click();
    await resolveLocator(this.page, login.success).waitFor({
      state: "visible",
      timeout: env.timeouts.navigation,
    });
  }
}
