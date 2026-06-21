import { useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { biometricGate, type AuthLevel, type BiometricGate } from '../auth/biometricGate';

export type GateStatus = 'locked' | 'unlocked';

/** Subconjunto de `AppState` necessário ao gate — injetável em teste. */
export interface AppStateLike {
  addEventListener(
    type: 'change',
    listener: (status: AppStateStatus) => void,
  ): { remove(): void };
}

export interface UseBiometricGateOptions {
  gate?: BiometricGate;
  appState?: AppStateLike;
}

export interface BiometricGateState {
  status: GateStatus;
  /** Método disponível; `null` enquanto ainda não foi resolvido. */
  level: AuthLevel | null;
  authenticating: boolean;
  unlock: () => Promise<boolean>;
  lock: () => void;
}

/**
 * Estado bloqueado/desbloqueado do Cofre.
 *
 * - Com biometria ou PIN/senha do dispositivo: pede autenticação para desbloquear
 *   e volta a `locked` quando o app sai de `active` (re-gate ao retornar).
 * - Sem nenhum bloqueio de tela (`level === 'none'`): não há o que autenticar nem
 *   o que proteger, então libera — evita travar aparelhos sem biometria.
 */
export function useBiometricGate(options: UseBiometricGateOptions = {}): BiometricGateState {
  const gate = options.gate ?? biometricGate;
  const appState = options.appState ?? AppState;

  const [status, setStatus] = useState<GateStatus>('locked');
  const [level, setLevel] = useState<AuthLevel | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  const lock = useCallback(() => setStatus('locked'), []);

  const unlock = useCallback(async () => {
    setAuthenticating(true);
    try {
      const ok = await gate.authenticate();
      setStatus(ok ? 'unlocked' : 'locked');
      return ok;
    } catch {
      // Falha do módulo nativo → mantém bloqueado, sem crash.
      setStatus('locked');
      return false;
    } finally {
      setAuthenticating(false);
    }
  }, [gate]);

  useEffect(() => {
    let mounted = true;
    gate
      .level()
      .then((value) => {
        if (mounted) setLevel(value);
      })
      .catch(() => {
        // Sem módulo/hardware → trata como sem método de autenticação.
        if (mounted) setLevel('none');
      });
    return () => {
      mounted = false;
    };
  }, [gate]);

  // Sem método de autenticação → libera (não há o que proteger).
  useEffect(() => {
    if (level === 'none') setStatus('unlocked');
  }, [level]);

  // Re-gate em background só faz sentido quando há método de autenticação.
  useEffect(() => {
    if (level === null || level === 'none') return;
    const subscription = appState.addEventListener('change', (next) => {
      if (next !== 'active') setStatus('locked');
    });
    return () => subscription.remove();
  }, [appState, level]);

  return { status, level, authenticating, unlock, lock };
}
