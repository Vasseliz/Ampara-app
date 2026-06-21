import type { HabitEntry } from '../api/habits.schemas';

/**
 * Regras de domínio de Hábitos. Validação numérica isolada dos schemas Zod para
 * teste direto. Espelha `RegistrarHabitoCasoDeUso` do backend (todos inteiros).
 */

export const SLEEP_HOURS_MIN = 0;
export const SLEEP_HOURS_MAX = 12;
export const SLEEP_QUALITY_MIN = 1;
export const SLEEP_QUALITY_MAX = 5;
export const WATER_MIN = 0;
export const WATER_MAX = 4;

function isIntInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

/** Horas de sono válidas: inteiro entre 0 e 12 (inclusive). */
export function isValidSleepHours(hours: number): boolean {
  return isIntInRange(hours, SLEEP_HOURS_MIN, SLEEP_HOURS_MAX);
}

/** Qualidade do sono válida: inteiro entre 1 e 5 (inclusive). */
export function isValidSleepQuality(quality: number): boolean {
  return isIntInRange(quality, SLEEP_QUALITY_MIN, SLEEP_QUALITY_MAX);
}

/** Água válida: inteiro (litros) entre 0 e 4 (inclusive). */
export function isValidWater(liters: number): boolean {
  return isIntInRange(liters, WATER_MIN, WATER_MAX);
}

export interface HabitsInput {
  exercitou: boolean;
  horasSono: number;
  qualidadeSono: number;
  agua: number;
}

/** Verdadeiro quando todas as faixas do conjunto de hábitos são válidas. */
export function areValidHabits(input: HabitsInput): boolean {
  return (
    typeof input.exercitou === 'boolean' &&
    isValidSleepHours(input.horasSono) &&
    isValidSleepQuality(input.qualidadeSono) &&
    isValidWater(input.agua)
  );
}

/**
 * Regra "tem registro hoje": o paciente registra hábitos uma vez por dia. Recebe
 * o payload de `GET /habits/today` (entrada de hoje, ou `null` quando não há).
 */
export function temRegistroHoje(today: HabitEntry | null): boolean {
  return today !== null;
}
