import { z } from 'zod';

/**
 * Schemas Zod do Chat. Contratos do backend:
 * - conversa: `{ pacienteId, profissionalId, contactName, contactEmail }`
 * - mensagem: `{ id, enviadoPeloPaciente, content, read, createdAt }`
 * - envio (POST): `{ content }`
 */
export const conversationSchema = z.object({
  pacienteId: z.string(),
  profissionalId: z.string(),
  contactName: z.string(),
  contactEmail: z.string(),
});

export const conversationsSchema = z.array(conversationSchema);

export const messageSchema = z.object({
  id: z.string(),
  enviadoPeloPaciente: z.boolean(),
  content: z.string(),
  read: z.boolean(),
  createdAt: z.string(),
});

export const messagesSchema = z.array(messageSchema);

/** Payload de envio: conteúdo não vazio após trim. O limite visual (500) é do input. */
export const sendMessageSchema = z.object({
  content: z.string().trim().min(1),
});

export type Conversation = z.infer<typeof conversationSchema>;
export type Message = z.infer<typeof messageSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
