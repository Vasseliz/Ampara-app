export interface Invitation {
  id: string;
  professionalName: string;
  professionalEmail: string;
  sentAt: string;
  expiresAt: string;
}

const TOKEN_PATTERN = /^[a-f0-9]{32}$/i;

export function normalizeInviteToken(value: string | string[] | undefined): string | null {
  const token = Array.isArray(value) ? value[0] : value;
  const normalized = token?.trim() ?? '';
  return TOKEN_PATTERN.test(normalized) ? normalized : null;
}

export function isInviteExpired(invite: Pick<Invitation, 'expiresAt'>, now = new Date()): boolean {
  const expiration = new Date(invite.expiresAt);
  return !Number.isFinite(expiration.getTime()) || expiration.getTime() <= now.getTime();
}
