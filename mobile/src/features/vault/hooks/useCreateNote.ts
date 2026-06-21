import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVaultNote } from '../api/vault.api';
import { vaultKeys } from '../api/vault.keys';

/** Cria uma nota e invalida a lista do Cofre. */
export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVaultNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vaultKeys.notes() }),
  });
}
