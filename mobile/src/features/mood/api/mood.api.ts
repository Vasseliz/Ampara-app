import { apiClient } from '@/core/api';
import {
  createMoodSchema,
  moodEntrySchema,
  moodHistorySchema,
  registeredMoodSchema,
  type CreateMoodInput,
  type MoodEntry,
  type RegisteredMood,
} from './mood.schemas';

/**
 * GET /mood/today — registro de humor de hoje. O backend responde 204 quando
 * ainda não há registro; o client devolve `undefined` nesse caso e mapeamos
 * para `null` (estado "sem registro hoje").
 */
export async function fetchMoodToday(): Promise<MoodEntry | null> {
  const data = await apiClient.request<unknown>('/mood/today');
  if (data == null) return null;
  return moodEntrySchema.parse(data);
}

/** GET /mood/history?days=N — histórico do período. */
export async function fetchMoodHistory(days: number): Promise<MoodEntry[]> {
  const data = await apiClient.request<unknown>(`/mood/history?days=${days}`);
  return moodHistorySchema.parse(data).entries;
}

/** POST /mood — registra o humor do dia. Lança `ApiError('conflict')` em 409. */
export async function createMood(input: CreateMoodInput): Promise<RegisteredMood> {
  const payload = createMoodSchema.parse(input);
  const data = await apiClient.request<unknown>('/mood', {
    method: 'POST',
    body: { score: payload.score, factors: payload.factors, notes: payload.notes },
  });
  return registeredMoodSchema.parse(data);
}
