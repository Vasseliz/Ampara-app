import type {
  AdherencePoint,
  NormalizedAdherence,
} from './medication.types';

const DAYS_IN_WINDOW = 7;

export function normalizeAdherenceValue(value: number | null): number | null {
  if (value === null) return null;
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError('Adherence value must be between 0 and 100');
  }

  return Math.round(value <= 1 ? value * 100 : value);
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function dateFromIso(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

export function buildSevenDayAdherence(
  data: AdherencePoint[],
  averageAdherence: number | null,
  referenceDate: Date = new Date(),
): NormalizedAdherence {
  if (data.length === 0) {
    return { data: [], averageAdherence: 0 };
  }

  const valuesByDate = new Map(
    data.map((point) => [point.date, normalizeAdherenceValue(point.value)]),
  );
  const end = dateFromIso(toIsoDate(referenceDate));
  const normalizedData: AdherencePoint[] = [];

  for (let offset = DAYS_IN_WINDOW - 1; offset >= 0; offset -= 1) {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - offset);
    const isoDate = toIsoDate(date);

    normalizedData.push({
      day: date.getUTCDate(),
      date: isoDate,
      value: valuesByDate.get(isoDate) ?? null,
    });
  }

  const normalizedAverage = normalizeAdherenceValue(averageAdherence);
  const availableValues = normalizedData.flatMap((point) =>
    point.value === null ? [] : [point.value],
  );

  return {
    data: normalizedData,
    averageAdherence: normalizedAverage ?? average(availableValues),
  };
}
