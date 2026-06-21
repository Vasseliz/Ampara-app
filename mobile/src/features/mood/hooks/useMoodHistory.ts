import { useQuery } from '@tanstack/react-query';
import { fetchMoodHistory } from '../api/mood.api';
import { moodKeys } from '../api/mood.keys';

/** Histórico de humor para o período (`days`). */
export function useMoodHistory(days: number, enabled = true) {
  return useQuery({
    queryKey: moodKeys.history(days),
    queryFn: () => fetchMoodHistory(days),
    enabled,
  });
}
