import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Adapter sobre Expo LocalAuthentication, seguindo o padrão de módulo nativo
 * mockável da Fundação. A interface é mínima e o módulo nativo é injetado,
 * então os testes passam um fake (ver `src/test/mocks/native.ts` →
 * `createLocalAuthenticationMock`) sem mocks globais.
 *
 * `getEnrolledLevelAsync` retorna o nível de segurança cadastrado:
 * 0 = nenhum, 1 = credencial do dispositivo (PIN/padrão/senha), 2/3 = biometria.
 */
export interface LocalAuthModule {
  getEnrolledLevelAsync(): Promise<number>;
  authenticateAsync(options?: {
    promptMessage?: string;
    disableDeviceFallback?: boolean;
  }): Promise<{ success: boolean }>;
}

/** Nível de autenticação disponível no dispositivo. */
export type AuthLevel = 'none' | 'credential' | 'biometric';

export interface BiometricGate {
  /** Método de autenticação disponível: nenhum, PIN/senha do dispositivo, ou biometria. */
  level(): Promise<AuthLevel>;
  /** Solicita autenticação (biometria ou, se não houver, PIN/senha do dispositivo). */
  authenticate(promptMessage?: string): Promise<boolean>;
}

const DEFAULT_PROMPT = 'Desbloquear o Cofre';

function toLevel(securityLevel: number): AuthLevel {
  if (securityLevel <= 0) return 'none';
  if (securityLevel === 1) return 'credential';
  return 'biometric';
}

export function createBiometricGate(native: LocalAuthModule): BiometricGate {
  return {
    async level() {
      return toLevel(await native.getEnrolledLevelAsync());
    },
    async authenticate(promptMessage = DEFAULT_PROMPT) {
      // `disableDeviceFallback: false` permite cair para o PIN/senha do dispositivo
      // quando não há biometria cadastrada — evita travar quem não usa biometria.
      const result = await native.authenticateAsync({
        promptMessage,
        disableDeviceFallback: false,
      });
      return result.success;
    },
  };
}

/** Instância padrão ligada ao módulo nativo real. */
export const biometricGate = createBiometricGate(LocalAuthentication);
