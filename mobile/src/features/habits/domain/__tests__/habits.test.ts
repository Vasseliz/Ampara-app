import {
  areValidHabits,
  isValidSleepHours,
  isValidSleepQuality,
  isValidWater,
  temRegistroHoje,
} from '../habits';
import {
  createHabitsSchema,
  habitEntrySchema,
  habitsHistorySchema,
} from '../../api/habits.schemas';

describe('domínio de Hábitos — sono (horas)', () => {
  it('aceita 0 e 12, rejeita -1 e 13', () => {
    expect(isValidSleepHours(0)).toBe(true);
    expect(isValidSleepHours(12)).toBe(true);
    expect(isValidSleepHours(-1)).toBe(false);
    expect(isValidSleepHours(13)).toBe(false);
  });
});

describe('domínio de Hábitos — qualidade do sono', () => {
  it('aceita 1 e 5, rejeita 0 e 6', () => {
    expect(isValidSleepQuality(1)).toBe(true);
    expect(isValidSleepQuality(5)).toBe(true);
    expect(isValidSleepQuality(0)).toBe(false);
    expect(isValidSleepQuality(6)).toBe(false);
  });
});

describe('domínio de Hábitos — água (litros)', () => {
  it('aceita 0 e 4, rejeita 4.1', () => {
    expect(isValidWater(0)).toBe(true);
    expect(isValidWater(4)).toBe(true);
    expect(isValidWater(4.1)).toBe(false);
  });
});

describe('domínio de Hábitos — combinação e registro de hoje', () => {
  it('areValidHabits valida o conjunto', () => {
    expect(areValidHabits({ exercitou: true, horasSono: 8, qualidadeSono: 4, agua: 2 })).toBe(true);
    expect(areValidHabits({ exercitou: true, horasSono: 13, qualidadeSono: 4, agua: 2 })).toBe(false);
  });

  it('temRegistroHoje reflete o payload de hoje', () => {
    expect(temRegistroHoje(null)).toBe(false);
    expect(
      temRegistroHoje({
        id: 'h1',
        exercitou: false,
        horasSono: 7,
        qualidadeSono: 3,
        agua: 2,
        date: '2026-06-21',
      }),
    ).toBe(true);
  });
});

describe('schemas de Hábitos', () => {
  it('aceita entrada bem formada', () => {
    expect(
      habitEntrySchema.safeParse({
        id: 'h1',
        exercitou: true,
        horasSono: 8,
        qualidadeSono: 4,
        agua: 2,
        date: '2026-06-21',
      }).success,
    ).toBe(true);
  });

  it('rejeita payload incompleto', () => {
    expect(habitEntrySchema.safeParse({ id: 'h1' }).success).toBe(false);
  });

  it('createHabitsSchema valida faixas e rejeita fora delas', () => {
    expect(
      createHabitsSchema.safeParse({ exercitou: true, horasSono: 8, qualidadeSono: 5, agua: 4 })
        .success,
    ).toBe(true);
    expect(
      createHabitsSchema.safeParse({ exercitou: true, horasSono: 8, qualidadeSono: 6, agua: 4 })
        .success,
    ).toBe(false);
    expect(
      createHabitsSchema.safeParse({ exercitou: true, horasSono: 8, qualidadeSono: 5, agua: 4.1 })
        .success,
    ).toBe(false);
  });

  it('habitsHistorySchema espera { entries: [...] }', () => {
    expect(habitsHistorySchema.safeParse({ entries: [] }).success).toBe(true);
    expect(habitsHistorySchema.safeParse([]).success).toBe(false);
  });
});
