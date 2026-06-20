/**
 * Máquina de estados pura da autenticação. Sem efeitos colaterais — o
 * `AuthContext` aplica este reducer e executa I/O (Supabase, SecureStore)
 * separadamente. Mantém a lógica de transição testável isoladamente.
 */

export type AuthRole = 'patient' | 'professional';

export interface AuthUser {
  id: string;
  role: AuthRole;
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: AuthUser }
  | { status: 'unauthenticated' }
  | { status: 'error'; error: string };

export type AuthAction =
  | { type: 'BOOTSTRAP_RESTORED'; user: AuthUser }
  | { type: 'BOOTSTRAP_EMPTY' }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: AuthUser }
  | { type: 'LOGIN_ERROR'; error: string }
  | { type: 'LOGOUT' };

export const initialAuthState: AuthState = { status: 'loading' };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'BOOTSTRAP_RESTORED':
    case 'LOGIN_SUCCESS':
      return { status: 'authenticated', user: action.user };
    case 'BOOTSTRAP_EMPTY':
    case 'LOGOUT':
      return { status: 'unauthenticated' };
    case 'LOGIN_START':
      return { status: 'loading' };
    case 'LOGIN_ERROR':
      return { status: 'error', error: action.error };
    default:
      return state;
  }
}
