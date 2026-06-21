import { useQuery } from '@tanstack/react-query';
import { fetchMoodToday } from '../api/mood.api';
import { moodKeys } from '../api/mood.keys';

/** Registro de humor de hoje (`null` quando ainda não há). */
export function useMoodToday(enabled = true) {
  return useQuery({
    queryKey: moodKeys.today(),
    queryFn: fetchMoodToday,
    enabled,
  });
}
