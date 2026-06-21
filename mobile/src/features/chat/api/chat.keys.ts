/** Query keys do Chat. Centralizadas para invalidação consistente. */
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  messages: (pacienteId: string, profissionalId: string) =>
    [...chatKeys.all, 'messages', pacienteId, profissionalId] as const,
};
