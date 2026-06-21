import { apiClient } from '@/core/api';
import {
  fetchMedicationAdherence,
  fetchTodayMedications,
  takeMedication,
} from '../medications.api';

jest.mock('@/core/api', () => ({
  apiClient: { request: jest.fn() },
}));

const request = jest.mocked(apiClient.request);

beforeEach(() => jest.clearAllMocks());

describe('API de Medicamentos', () => {
  it('busca a lista de hoje', async () => {
    request.mockResolvedValue({ today: [], all: [] });
    await expect(fetchTodayMedications()).resolves.toEqual([]);
    expect(request).toHaveBeenCalledWith('/medications');
  });

  it('normaliza a adesão retornada pelo backend', async () => {
    request.mockResolvedValue({
      data: [{ day: 21, date: '2026-06-21', value: 0.5 }],
      averageAdherence: 0.5,
    });

    const result = await fetchMedicationAdherence();

    expect(request).toHaveBeenCalledWith('/medications/adherence');
    expect(result.averageAdherence).toBe(50);
  });

  it('registra tomada na rota correta', async () => {
    request.mockResolvedValue({ taken: true, takenAt: '2026-06-21T12:00:00Z' });
    await takeMedication('550e8400-e29b-41d4-a716-446655440000');

    expect(request).toHaveBeenCalledWith(
      '/medications/550e8400-e29b-41d4-a716-446655440000/take',
      { method: 'POST' },
    );
  });
});
