export const invitationKeys = {
  all: ['invitations'] as const,
  received: () => [...invitationKeys.all, 'received'] as const,
};
