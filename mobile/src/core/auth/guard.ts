import type { AuthState } from './authMachine';

/**
 * Decisões de roteamento puras a partir do estado de sessão. Isoladas aqui para
 * serem testáveis sem montar a navegação. O app é exclusivo de paciente: papéis
 * diferentes são redirecionados para login.
 */
export type PatientAccess = 'loading' | 'allow' | 'redirect-login';
export type InitialRoute = 'loading' | 'patient' | 'public';

export function decidePatientAccess(state: AuthState): PatientAccess {
  if (state.status === 'loading') return 'loading';
  if (state.status === 'authenticated' && state.user.role === 'patient') return 'allow';
  return 'redirect-login';
}

export function decideInitialRoute(state: AuthState): InitialRoute {
  if (state.status === 'loading') return 'loading';
  if (state.status === 'authenticated' && state.user.role === 'patient') return 'patient';
  return 'public';
}
