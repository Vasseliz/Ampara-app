import { useQuery } from '@tanstack/react-query';
import { fetchHabitsToday } from '../api/habits.api';
import { habitsKeys } from '../api/habits.keys';

/** Registro de hábitos de hoje (`null` quando ainda não há). */
export function useHabitsToday(enabled = true) {
  return useQuery({
    queryKey: habitsKeys.today(),
    queryFn: fetchHabitsToday,
    enabled,
  });
}
