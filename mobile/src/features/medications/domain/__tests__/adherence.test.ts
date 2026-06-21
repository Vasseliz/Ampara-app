import {
  buildSevenDayAdherence,
  normalizeAdherenceValue,
} from '../adherence';

describe('normalizeAdherenceValue', () => {
  it('converte valores de 0..1 para percentual', () => {
    expect(normalizeAdherenceValue(0.5)).toBe(50);
  });

  it('mantém valores que já estão no intervalo percentual', () => {
    expect(normalizeAdherenceValue(50)).toBe(50);
  });

  it('preserva ausência de valor', () => {
    expect(normalizeAdherenceValue(null)).toBeNull();
  });
});

describe('buildSevenDayAdherence', () => {
  it('retorna série vazia e média zero quando não há dados', () => {
    expect(buildSevenDayAdherence([], null)).toEqual({
      data: [],
      averageAdherence: 0,
    });
  });

  it('preenche uma janela de sete dias com null nos dias faltantes', () => {
    const result = buildSevenDayAdherence(
      [
        { day: 16, date: '2026-06-16', value: 0.5 },
        { day: 19, date: '2026-06-19', value: 75 },
        { day: 21, date: '2026-06-21', value: null },
      ],
      0.5,
      new Date('2026-06-21T12:00:00.000Z'),
    );

    expect(result.data).toHaveLength(7);
    expect(result.data.map(({ date, value }) => ({ date, value }))).toEqual([
      { date: '2026-06-15', value: null },
      { date: '2026-06-16', value: 50 },
      { date: '2026-06-17', value: null },
      { date: '2026-06-18', value: null },
      { date: '2026-06-19', value: 75 },
      { date: '2026-06-20', value: null },
      { date: '2026-06-21', value: null },
    ]);
    expect(result.averageAdherence).toBe(50);
  });
});
