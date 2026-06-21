import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../api/chat.api';
import { chatKeys } from '../api/chat.keys';
import type { ChatMessage } from '../domain/message';

export interface SendMessageVars {
  content: string;
  /** Em retry, reenvia a mesma mensagem otimista (sem duplicar). */
  clientId?: string;
}

interface SendContext {
  clientId: string;
}

/**
 * Envio otimista de mensagem. A mensagem aparece imediatamente como `sending`;
 * no sucesso vira a mensagem confirmada do servidor (`sent`) e o histórico é
 * invalidado; em erro vira `failed` (sem sumir), permitindo retry com o mesmo
 * `clientId`.
 */
export function useSendMessage(pacienteId: string, profissionalId: string) {
  const queryClient = useQueryClient();
  const key = chatKeys.messages(pacienteId, profissionalId);

  return useMutation<ChatMessage, unknown, SendMessageVars, SendContext>({
    mutationFn: async ({ content }) => sendMessage(pacienteId, profissionalId, { content }),

    onMutate: async ({ content, clientId }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ChatMessage[]>(key) ?? [];
      const id = clientId ?? `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const alreadyThere = previous.some((m) => m.clientId === id);
      const next: ChatMessage[] = alreadyThere
        ? previous.map((m) => (m.clientId === id ? { ...m, status: 'sending' } : m))
        : [
            ...previous,
            {
              id,
              clientId: id,
              content,
              enviadoPeloPaciente: true,
              read: false,
              createdAt: new Date().toISOString(),
              status: 'sending',
            },
          ];

      queryClient.setQueryData<ChatMessage[]>(key, next);
      return { clientId: id };
    },

    onSuccess: (serverMessage, _vars, context) => {
      queryClient.setQueryData<ChatMessage[]>(key, (current = []) =>
        current.map((m) =>
          m.clientId === context?.clientId
            ? { ...serverMessage, clientId: context.clientId, status: 'sent' }
            : m,
        ),
      );
      queryClient.invalidateQueries({ queryKey: key });
    },

    onError: (_error, _vars, context) => {
      queryClient.setQueryData<ChatMessage[]>(key, (current = []) =>
        current.map((m) => (m.clientId === context?.clientId ? { ...m, status: 'failed' } : m)),
      );
    },
  });
}
