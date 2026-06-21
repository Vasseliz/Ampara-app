/** Query keys do Cofre. Centralizadas para invalidação consistente. */
export const vaultKeys = {
  all: ['vault'] as const,
  notes: () => [...vaultKeys.all, 'notes'] as const,
};
