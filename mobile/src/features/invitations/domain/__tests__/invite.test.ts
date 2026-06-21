import { isInviteExpired, normalizeInviteToken } from '../invite';

describe('domínio de Convites', () => {
  it('identifica convite expirado', () => {
    expect(
      isInviteExpired(
        { expiresAt: '2026-06-20T12:00:00Z' },
        new Date('2026-06-21T12:00:00Z'),
      ),
    ).toBe(true);
  });

  it('mantém convite dentro do prazo como válido', () => {
    expect(
      isInviteExpired(
        { expiresAt: '2026-06-22T12:00:00Z' },
        new Date('2026-06-21T12:00:00Z'),
      ),
    ).toBe(false);
  });

  it('normaliza token válido e rejeita token malformado', () => {
    expect(normalizeInviteToken('0123456789abcdef0123456789abcdef')).toBe(
      '0123456789abcdef0123456789abcdef',
    );
    expect(normalizeInviteToken('token-curto')).toBeNull();
    expect(normalizeInviteToken(undefined)).toBeNull();
  });
});
