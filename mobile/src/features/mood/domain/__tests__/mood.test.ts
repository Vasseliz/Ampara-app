import {
  ALLOWED_MOOD_FACTORS,
  areValidMoodFactors,
  isAllowedMoodFactor,
  isValidMoodScore,
  temRegistroHoje,
} from '../mood';
import { createMoodSchema, moodEntrySchema, moodHistorySchema } from '../../api/mood.schemas';

describe('domínio de Humor — pontuação', () => {
  it('aceita 0 e 10 e rejeita -1 e 11', () => {
    expect(isValidMoodScore(0)).toBe(true);
    expect(isValidMoodScore(10)).toBe(true);
    expect(isValidMoodScore(-1)).toBe(false);
    expect(isValidMoodScore(11)).toBe(false);
  });

  it('rejeita pontuação não inteira', () => {
    expect(isValidMoodScore(5.5)).toBe(false);
  });
});

describe('domínio de Humor — fatores', () => {
  it('aceita fatores da lista permitida e rejeita fora dela', () => {
    expect(isAllowedMoodFactor('Sono')).toBe(true);
    expect(areValidMoodFactors([...ALLOWED_MOOD_FACTORS])).toBe(true);
    expect(areValidMoodFactors(['Sono', 'Inexistente'])).toBe(false);
  });
});

describe('domínio de Humor — registro de hoje', () => {
  it('temRegistroHoje reflete o payload de hoje', () => {
    expect(temRegistroHoje(null)).toBe(false);
    expect(
      temRegistroHoje({ id: '1', score: 7, factors: ['Sono'], notes: null, date: '2026-06-21' }),
    ).toBe(true);
  });
});

describe('schemas de Humor', () => {
  it('aceita uma entrada bem formada (notes nulo permitido)', () => {
    expect(
      moodEntrySchema.safeParse({
        id: 'm1',
        score: 8,
        factors: ['Sono'],
        notes: null,
        date: '2026-06-21',
      }).success,
    ).toBe(true);
  });

  it('rejeita entrada sem campos obrigatórios', () => {
    expect(moodEntrySchema.safeParse({ id: 'm1' }).success).toBe(false);
  });

  it('createMoodSchema rejeita score fora da faixa e fator inválido', () => {
    expect(createMoodSchema.safeParse({ score: 11 }).success).toBe(false);
    expect(createMoodSchema.safeParse({ score: 5, factors: ['Inexistente'] }).success).toBe(false);
    expect(
      createMoodSchema.safeParse({ score: 5, factors: ['Sono'], notes: 'ok' }).success,
    ).toBe(true);
  });

  it('moodHistorySchema espera { entries: [...] }', () => {
    expect(moodHistorySchema.safeParse({ entries: [] }).success).toBe(true);
    expect(moodHistorySchema.safeParse([]).success).toBe(false);
  });
});
