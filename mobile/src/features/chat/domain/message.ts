import type { Message } from '../api/chat.schemas';

/** Estado de envio de uma mensagem otimista (UI). `undefined` = confirmada pelo servidor. */
export type MessageStatus = 'sending' | 'sent' | 'failed';

/** Mensagem na visão da UI: a do servidor + estado otimista local. */
export interface ChatMessage extends Message {
  status?: MessageStatus;
  /** Id estável local para reconciliar otimista ↔ servidor e permitir retry. */
  clientId?: string;
}

/** Limite visual de caracteres no input (paridade com o web; a API não impõe). */
export const MAX_MESSAGE_LENGTH = 500;

/** Conteúdo válido: não vazio após trim e dentro do limite visual. */
export function isValidMessageContent(content: string): boolean {
  const trimmed = content.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_MESSAGE_LENGTH;
}

/** Normaliza o conteúdo para envio (remove espaços nas bordas). */
export function normalizeMessageContent(content: string): string {
  return content.trim();
}

/** Ordena cronologicamente por `createdAt` (mais antiga → mais recente). */
export function sortMessagesChronologically<T extends Message>(messages: T[]): T[] {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}
