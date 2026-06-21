import { useQuery } from '@tanstack/react-query';
import { fetchVaultNotes } from '../api/vault.api';
import { vaultKeys } from '../api/vault.keys';

/**
 * Lista as notas do Cofre. `enabled` permite só buscar quando desbloqueado —
 * o conteúdo não deve ser carregado antes do gate de biometria.
 */
export function useVaultNotes(enabled = true) {
  return useQuery({
    queryKey: vaultKeys.notes(),
    queryFn: fetchVaultNotes,
    enabled,
  });
}
