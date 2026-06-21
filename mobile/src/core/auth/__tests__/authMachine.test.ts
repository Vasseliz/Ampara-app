import { authReducer, initialAuthState, type AuthState, type AuthUser } from '../authMachine';

const patient: AuthUser = { id: 'u1', role: 'patient' };

describe('authReducer', () => {
  it('parte de loading', () => {
    expect(initialAuthState).toEqual({ status: 'loading' });
  });

  it('login bem-sucedido → authenticated com usuário', () => {
    const next = authReducer({ status: 'loading' }, { type: 'LOGIN_SUCCESS', user: patient });
    expect(next).toEqual({ status: 'authenticated', user: patient });
  });

  it('bootstrap restaurado → authenticated', () => {
    const next = authReducer(initialAuthState, { type: 'BOOTSTRAP_RESTORED', user: patient });
    expect(next).toEqual({ status: 'authenticated', user: patient });
  });

  it('bootstrap vazio → unauthenticated', () => {
    expect(authReducer(initialAuthState, { type: 'BOOTSTRAP_EMPTY' })).toEqual({
      status: 'unauthenticated',
    });
  });

  it('credenciais inválidas → error com mensagem', () => {
    const next = authReducer({ status: 'loading' }, { type: 'LOGIN_ERROR', error: 'inválido' });
    expect(next).toEqual({ status: 'error', error: 'inválido' });
  });

  it('logout → unauthenticated', () => {
    const authed: AuthState = { status: 'authenticated', user: patient };
    expect(authReducer(authed, { type: 'LOGOUT' })).toEqual({ status: 'unauthenticated' });
  });
});
