import { z } from 'zod';
import { ALLOWED_MOOD_FACTORS, MOOD_SCORE_MAX, MOOD_SCORE_MIN } from '../domain/mood';

/**
 * Schemas Zod nas bordas de Humor. Contratos do backend (`/mood`):
 * - hoje (`GET /mood/today`): `{ id, score, factors, notes, date }` — `notes` pode ser nulo;
 *   204 (sem registro) é tratado como `null` na camada de API.
 * - histórico (`GET /mood/history?days=N`): `{ entries: [ ...entrada ] }`.
 * - criação (`POST /mood`): recebe `{ score, factors?, notes? }`, responde `{ id, score, date }`.
 */
export const moodEntrySchema = z.object({
  id: z.string(),
  score: z.number(),
  factors: z.array(z.string()),
  notes: z.string().nullable(),
  date: z.string(),
});

export const moodHistorySchema = z.object({
  entries: z.array(moodEntrySchema),
});

/** Payload de criação: faixa 0–10 (inteiro) e apenas fatores permitidos. */
export const createMoodSchema = z.object({
  score: z.number().int().min(MOOD_SCORE_MIN).max(MOOD_SCORE_MAX),
  factors: z.array(z.enum(ALLOWED_MOOD_FACTORS)).default([]),
  notes: z.string().optional(),
});

/** Resposta de `POST /mood`. */
export const registeredMoodSchema = z.object({
  id: z.string(),
  score: z.number(),
  date: z.string(),
});

export type MoodEntry = z.infer<typeof moodEntrySchema>;
export type MoodHistory = z.infer<typeof moodHistorySchema>;
export type CreateMoodInput = z.infer<typeof createMoodSchema>;
export type RegisteredMood = z.infer<typeof registeredMoodSchema>;
