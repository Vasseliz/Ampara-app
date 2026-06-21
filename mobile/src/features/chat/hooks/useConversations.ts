import { useQuery } from '@tanstack/react-query';
import { fetchConversations } from '../api/chat.api';
import { chatKeys } from '../api/chat.keys';

/** Lista as conversas do usuário a partir dos vínculos. */
export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: fetchConversations,
  });
}
