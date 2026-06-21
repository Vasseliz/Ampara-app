import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '@/core/api';
import { medicationKeys } from '../../api/medications.keys';
import * as medicationsApi from '../../api/medications.api';
import { useAdherence } from '../useAdherence';
import { useTakeMedication } from '../useTakeMedication';
import { useTodayMedications } from '../useTodayMedications';

jest.mock('../../api/medications.api');
const api = jest.mocked(medicationsApi);

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

const medication = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Losartana',
  dosage: '50 mg',
  time: '08:00',
  taken: false,
  observation: null,
  active: true,
};

beforeEach(() => jest.clearAllMocks());

describe('hooks de Medicamentos', () => {
  it('lista os medicamentos ativos de hoje', async () => {
    api.fetchTodayMedications.mockResolvedValue([medication]);
    const { wrapper } = setup();
    const { result } = await renderHook(() => useTodayMedications(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([medication]);
  });

  it('retorna a adesão normalizada', async () => {
    api.fetchMedicationAdherence.mockResolvedValue({
      data: [{ day: 21, date: '2026-06-21', value: 50 }],
      averageAdherence: 50,
    });
    const { wrapper } = setup();
    const { result } = await renderHook(() => useAdherence(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.averageAdherence).toBe(50);
  });

  it('registra a tomada e invalida lista e adesão', async () => {
    api.takeMedication.mockResolvedValue({ taken: true, takenAt: '2026-06-21T12:00:00Z' });
    const { client, wrapper } = setup();
    const invalidate = jest.spyOn(client, 'invalidateQueries');
    const { result } = await renderHook(() => useTakeMedication(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(medication.id);
    });

    expect(api.takeMedication.mock.calls[0][0]).toBe(medication.id);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: medicationKeys.today() });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: medicationKeys.adherence() });
  });

  it('expõe falha de rede sem alterar cache local', async () => {
    api.takeMedication.mockRejectedValue(new ApiError('network', 0, 'offline'));
    const { client, wrapper } = setup();
    client.setQueryData(medicationKeys.today(), [medication]);
    const { result } = await renderHook(() => useTakeMedication(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(medication.id).catch(() => {});
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(client.getQueryData(medicationKeys.today())).toEqual([medication]);
  });
});
