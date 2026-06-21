import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMood } from '../api/mood.api';
import { moodKeys } from '../api/mood.keys';

/**
 * Registra o humor do dia e invalida `mood.today` + `mood.history`. O erro 409
 * (já registrado hoje) é propagado como `ApiError('conflict')` para o consumidor
 * tratar na tela.
 */
export function useSubmitMood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moodKeys.today() });
      queryClient.invalidateQueries({ queryKey: moodKeys.histories() });
    },
  });
}
