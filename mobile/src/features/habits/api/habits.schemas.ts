import { z } from 'zod';
import {
  SLEEP_HOURS_MAX,
  SLEEP_HOURS_MIN,
  SLEEP_QUALITY_MAX,
  SLEEP_QUALITY_MIN,
  WATER_MAX,
  WATER_MIN,
} from '../domain/habits';

/**
 * Schemas Zod nas bordas de Hábitos. Contratos do backend (`/habits`):
 * - hoje (`GET /habits/today`): `{ id, exercitou, horasSono, qualidadeSono, agua, date }`;
 *   204 (sem registro) é tratado como `null` na camada de API.
 * - histórico (`GET /habits/history?days=N`): `{ entries: [ ...entrada ] }`.
 * - criação (`POST /habits`): recebe `{ exercitou, horasSono, qualidadeSono, agua }`,
 *   responde `{ id, date }`.
 */
export const habitEntrySchema = z.object({
  id: z.string(),
  exercitou: z.boolean(),
  horasSono: z.number(),
  qualidadeSono: z.number(),
  agua: z.number(),
  date: z.string(),
});

export const habitsHistorySchema = z.object({
  entries: z.array(habitEntrySchema),
});

/** Payload de criação: faixas inteiras (sono 0–12, qualidade 1–5, água 0–4). */
export const createHabitsSchema = z.object({
  exercitou: z.boolean(),
  horasSono: z.number().int().min(SLEEP_HOURS_MIN).max(SLEEP_HOURS_MAX),
  qualidadeSono: z.number().int().min(SLEEP_QUALITY_MIN).max(SLEEP_QUALITY_MAX),
  agua: z.number().int().min(WATER_MIN).max(WATER_MAX),
});

/** Resposta de `POST /habits`. */
export const registeredHabitsSchema = z.object({
  id: z.string(),
  date: z.string(),
});

export type HabitEntry = z.infer<typeof habitEntrySchema>;
export type HabitsHistory = z.infer<typeof habitsHistorySchema>;
export type CreateHabitsInput = z.infer<typeof createHabitsSchema>;
export type RegisteredHabits = z.infer<typeof registeredHabitsSchema>;
