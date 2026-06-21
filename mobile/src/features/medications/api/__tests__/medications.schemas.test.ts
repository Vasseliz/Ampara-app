import {
  medicationAdherenceResponseSchema,
  medicationsResponseSchema,
} from '../medications.schemas';

const medication = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Losartana',
  dosage: '50 mg',
  time: '08:00',
  taken: false,
  observation: null,
  active: true,
};

describe('medicationsResponseSchema', () => {
  it('aceita o contrato válido de GET /medications', () => {
    const payload = {
      today: [medication],
      all: [{ ...medication, taken: true, observation: 'Após o café' }],
    };

    expect(medicationsResponseSchema.parse(payload)).toEqual(payload);
  });

  it.each([
    ['id não UUID', { today: [{ ...medication, id: '123' }], all: [] }],
    ['observation ausente', { today: [], all: [{ ...medication, observation: undefined }] }],
    ['taken não booleano', { today: [{ ...medication, taken: 'yes' }], all: [] }],
  ])('rejeita payload inválido: %s', (_scenario, payload) => {
    expect(medicationsResponseSchema.safeParse(payload).success).toBe(false);
  });
});

describe('medicationAdherenceResponseSchema', () => {
  it('aceita o contrato válido de GET /medications/adherence', () => {
    const payload = {
      data: [
        { day: 15, date: '2026-06-15', value: 0.5 },
        { day: 16, date: '2026-06-16', value: null },
      ],
      averageAdherence: 50,
    };

    expect(medicationAdherenceResponseSchema.parse(payload)).toEqual(payload);
  });

  it.each([
    [
      'data fora do formato YYYY-MM-DD',
      {
        data: [{ day: 15, date: '15/06/2026', value: 50 }],
        averageAdherence: 50,
      },
    ],
    [
      'value não numérico',
      {
        data: [{ day: 15, date: '2026-06-15', value: '50' }],
        averageAdherence: 50,
      },
    ],
    ['averageAdherence ausente', { data: [] }],
  ])('rejeita payload inválido: %s', (_scenario, payload) => {
    expect(medicationAdherenceResponseSchema.safeParse(payload).success).toBe(false);
  });
});
