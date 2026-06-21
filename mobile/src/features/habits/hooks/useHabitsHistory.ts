import { useQuery } from '@tanstack/react-query';
import { fetchHabitsHistory } from '../api/habits.api';
import { habitsKeys } from '../api/habits.keys';

/** Histórico de hábitos para o período (`days`). */
export function useHabitsHistory(days: number, enabled = true) {
  return useQuery({
    queryKey: habitsKeys.history(days),
    queryFn: () => fetchHabitsHistory(days),
    enabled,
  });
}
