import { createBiometricGate } from '../biometricGate';
import { createLocalAuthenticationMock } from '@/test/mocks/native';

describe('biometricGate (adapter)', () => {
  it('reporta nível biométrico quando há biometria cadastrada', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(true, 3));
    await expect(gate.level()).resolves.toBe('biometric');
  });

  it('reporta nível de credencial (PIN/senha) quando não há biometria, mas há bloqueio', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(true, 1));
    await expect(gate.level()).resolves.toBe('credential');
  });

  it('reporta nível none quando o aparelho não tem nenhum bloqueio', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(true, 0));
    await expect(gate.level()).resolves.toBe('none');
  });

  it('authenticate delega ao adapter (com fallback de credencial) e propaga sucesso', async () => {
    const native = createLocalAuthenticationMock(true);
    const gate = createBiometricGate(native);

    await expect(gate.authenticate('Desbloquear')).resolves.toBe(true);
    expect(native.authenticateAsync).toHaveBeenCalledWith({
      promptMessage: 'Desbloquear',
      disableDeviceFallback: false,
    });
  });

  it('authenticate propaga falha/cancelamento como false', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(false));
    await expect(gate.authenticate()).resolves.toBe(false);
  });
});
