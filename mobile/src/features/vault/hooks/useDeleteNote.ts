import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVaultNote } from '../api/vault.api';
import { vaultKeys } from '../api/vault.keys';

/** Exclui uma nota e invalida a lista do Cofre. */
export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVaultNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vaultKeys.notes() }),
  });
}
