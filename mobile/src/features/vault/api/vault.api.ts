import { apiClient } from '@/core/api';
import {
  vaultNoteSchema,
  vaultNotesSchema,
  type CreateVaultNoteInput,
  type VaultNote,
} from './vault.schemas';

/** GET /vault — lista as notas privadas do paciente autenticado. */
export async function fetchVaultNotes(): Promise<VaultNote[]> {
  const data = await apiClient.request<unknown>('/vault');
  return vaultNotesSchema.parse(data);
}

/** POST /vault — cria uma nota. */
export async function createVaultNote(input: CreateVaultNoteInput): Promise<VaultNote> {
  const data = await apiClient.request<unknown>('/vault', {
    method: 'POST',
    body: { content: input.content },
  });
  return vaultNoteSchema.parse(data);
}

/** DELETE /vault/{id} — exclui uma nota. */
export async function deleteVaultNote(id: string): Promise<void> {
  await apiClient.request<void>(`/vault/${id}`, { method: 'DELETE' });
}
