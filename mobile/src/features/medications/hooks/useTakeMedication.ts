import { useMutation, useQueryClient } from '@tanstack/react-query';
import { takeMedication } from '../api/medications.api';
import { medicationKeys } from '../api/medications.keys';

export function useTakeMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: takeMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicationKeys.today() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.adherence() });
    },
  });
}
