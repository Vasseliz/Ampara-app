import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '../api/chat.api';
import { chatKeys } from '../api/chat.keys';
import { sortMessagesChronologically, type ChatMessage } from '../domain/message';

/** Histórico da conversa, retornado em ordem cronológica. */
export function useMessages(pacienteId: string, profissionalId: string, enabled = true) {
  return useQuery<ChatMessage[]>({
    queryKey: chatKeys.messages(pacienteId, profissionalId),
    queryFn: async () => sortMessagesChronologically(await fetchMessages(pacienteId, profissionalId)),
    enabled: enabled && Boolean(pacienteId) && Boolean(profissionalId),
  });
}
