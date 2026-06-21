import { useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHabits } from '../api/habits.api';
import { habitsKeys } from '../api/habits.keys';
import type { CreateHabitsInput } from '../api/habits.schemas';

/**
 * Registra os hábitos do dia e invalida `habits.today` + `habits.history`.
 *
 * Corrige a dívida do web: `submit` é guardado por uma flag de "em voo" — toques
 * repetidos enquanto o envio está pendente são ignorados (apenas 1 POST). A flag
 * (`ref`) garante o bloqueio mesmo no mesmo tick, antes de `isPending` atualizar.
 */
export function useSubmitHabits() {
  const queryClient = useQueryClient();
  const inFlight = useRef(false);

  const mutation = useMutation({
    mutationFn: createHabits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.today() });
      queryClient.invalidateQueries({ queryKey: habitsKeys.histories() });
    },
  });

  const submit = useCallback(
    (input: CreateHabitsInput) => {
      if (inFlight.current) return;
      inFlight.current = true;
      mutation.mutate(input, {
        onSettled: () => {
          inFlight.current = false;
        },
      });
    },
    [mutation],
  );

  return { ...mutation, submit };
}
