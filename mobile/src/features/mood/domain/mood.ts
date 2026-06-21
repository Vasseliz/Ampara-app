import type { MoodEntry } from '../api/mood.schemas';

/**
 * Regras de domínio de Humor. Validação numérica e de fatores fica aqui, isolada
 * dos schemas Zod, para teste direto. Espelha `RegistrarHumorCasoDeUso` do backend.
 */

/** Faixa válida de pontuação de humor (inclusive). */
export const MOOD_SCORE_MIN = 0;
export const MOOD_SCORE_MAX = 10;

/**
 * Fatores de humor aceitos pelo backend (`RegistrarHumorCasoDeUso.FatoresPermitidos`).
 * Fonte única para a validação do domínio e para o enum dos schemas Zod.
 */
export const ALLOWED_MOOD_FACTORS = [
  'Sono',
  'Exercício',
  'Trabalho',
  'Relacionamentos',
  'Saúde',
  'Alimentação',
  'Lazer',
  'Ansiedade',
] as const;

export type MoodFactor = (typeof ALLOWED_MOOD_FACTORS)[number];

/** Pontuação válida: inteiro entre 0 e 10 (inclusive). */
export function isValidMoodScore(score: number): boolean {
  return Number.isInteger(score) && score >= MOOD_SCORE_MIN && score <= MOOD_SCORE_MAX;
}

/** Verdadeiro quando o fator está na lista permitida pelo backend. */
export function isAllowedMoodFactor(factor: string): factor is MoodFactor {
  return (ALLOWED_MOOD_FACTORS as readonly string[]).includes(factor);
}

/** Verdadeiro quando todos os fatores informados são permitidos. */
export function areValidMoodFactors(factors: string[]): boolean {
  return factors.every(isAllowedMoodFactor);
}

/**
 * Regra "tem registro hoje": o paciente registra humor uma vez por dia. Recebe o
 * payload de `GET /mood/today` (entrada de hoje, ou `null` quando ainda não há).
 */
export function temRegistroHoje(today: MoodEntry | null): boolean {
  return today !== null;
}
