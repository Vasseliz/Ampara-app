import { apiClient } from '@/core/api';
import {
  conversationsSchema,
  messageSchema,
  messagesSchema,
  type Conversation,
  type Message,
  type SendMessageInput,
} from './chat.schemas';

/** GET /chat/conversations — conversas a partir dos vínculos do usuário. */
export async function fetchConversations(): Promise<Conversation[]> {
  const data = await apiClient.request<unknown>('/chat/conversations');
  return conversationsSchema.parse(data);
}

/** GET /chat/{pacienteId}/{profissionalId} — histórico da conversa. */
export async function fetchMessages(
  pacienteId: string,
  profissionalId: string,
): Promise<Message[]> {
  const data = await apiClient.request<unknown>(`/chat/${pacienteId}/${profissionalId}`);
  return messagesSchema.parse(data);
}

/** POST /chat/{pacienteId}/{profissionalId} — envia mensagem de texto. */
export async function sendMessage(
  pacienteId: string,
  profissionalId: string,
  input: SendMessageInput,
): Promise<Message> {
  const data = await apiClient.request<unknown>(`/chat/${pacienteId}/${profissionalId}`, {
    method: 'POST',
    body: { content: input.content },
  });
  return messageSchema.parse(data);
}
