import { decideInitialRoute, decidePatientAccess } from '../guard';
import type { AuthState } from '../authMachine';

const patient: AuthState = { status: 'authenticated', user: { id: 'u1', role: 'patient' } };
const professional: AuthState = {
  status: 'authenticated',
  user: { id: 'u2', role: 'professional' },
};

describe('decidePatientAccess', () => {
  it('sessão de paciente → permite acesso', () => {
    expect(decidePatientAccess(patient)).toBe('allow');
  });

  it('sem sessão → redireciona para login', () => {
    expect(decidePatientAccess({ status: 'unauthenticated' })).toBe('redirect-login');
  });

  it('sessão com papel diferente de paciente → redireciona (app é só paciente)', () => {
    expect(decidePatientAccess(professional)).toBe('redirect-login');
  });

  it('estado loading → ainda não decide', () => {
    expect(decidePatientAccess({ status: 'loading' })).toBe('loading');
  });
});

describe('decideInitialRoute', () => {
  it('paciente → rota de paciente', () => {
    expect(decideInitialRoute(patient)).toBe('patient');
  });
  it('não autenticado → rota pública', () => {
    expect(decideInitialRoute({ status: 'unauthenticated' })).toBe('public');
  });
  it('loading → loading', () => {
    expect(decideInitialRoute({ status: 'loading' })).toBe('loading');
  });
});
