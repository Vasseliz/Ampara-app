import { apiClient } from '@/core/api';
import {
  createHabitsSchema,
  habitEntrySchema,
  habitsHistorySchema,
  registeredHabitsSchema,
  type CreateHabitsInput,
  type HabitEntry,
  type RegisteredHabits,
} from './habits.schemas';

/**
 * GET /habits/today — registro de hábitos de hoje. O backend responde 204 quando
 * ainda não há registro; o client devolve `undefined` e mapeamos para `null`.
 */
export async function fetchHabitsToday(): Promise<HabitEntry | null> {
  const data = await apiClient.request<unknown>('/habits/today');
  if (data == null) return null;
  return habitEntrySchema.parse(data);
}

/** GET /habits/history?days=N — histórico do período. */
export async function fetchHabitsHistory(days: number): Promise<HabitEntry[]> {
  const data = await apiClient.request<unknown>(`/habits/history?days=${days}`);
  return habitsHistorySchema.parse(data).entries;
}

/** POST /habits — registra os hábitos do dia. */
export async function createHabits(input: CreateHabitsInput): Promise<RegisteredHabits> {
  const payload = createHabitsSchema.parse(input);
  const data = await apiClient.request<unknown>('/habits', {
    method: 'POST',
    body: {
      exercitou: payload.exercitou,
      horasSono: payload.horasSono,
      qualidadeSono: payload.qualidadeSono,
      agua: payload.agua,
    },
  });
  return registeredHabitsSchema.parse(data);
}
