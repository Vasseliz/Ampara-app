import { z } from 'zod';

/**
 * Schemas Zod nas bordas do Cofre. O backend (`/vault`) serializa
 * `{ id, content, createdAt }`; o POST recebe `{ content }`.
 */
export const vaultNoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export const vaultNotesSchema = z.array(vaultNoteSchema);

/** Payload de criação: conteúdo não vazio após remover espaços nas bordas. */
export const createVaultNoteSchema = z.object({
  content: z.string().trim().min(1),
});

export type VaultNote = z.infer<typeof vaultNoteSchema>;
export type CreateVaultNoteInput = z.infer<typeof createVaultNoteSchema>;
