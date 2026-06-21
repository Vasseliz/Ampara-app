import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useMoodToday } from '../useMoodToday';
import { useMoodHistory } from '../useMoodHistory';
import { useSubmitMood } from '../useSubmitMood';
import { moodKeys } from '../../api/mood.keys';
import { ApiError } from '@/core/api';
import * as moodApi from '../../api/mood.api';

jest.mock('../../api/mood.api');
const api = jest.mocked(moodApi);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

const entry = { id: 'm1', score: 7, factors: ['Sono'], notes: null, date: '2026-06-21' };

beforeEach(() => jest.clearAllMocks());

describe('hooks de Humor', () => {
  it('useMoodToday retorna o registro quando existe', async () => {
    api.fetchMoodToday.mockResolvedValue(entry);
    const { wrapper } = makeWrapper();

    const { result } = await renderHook(() => useMoodToday(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(entry);
  });

  it('useMoodToday retorna null quando não há registro hoje', async () => {
    api.fetchMoodToday.mockResolvedValue(null);
    const { wrapper } = makeWrapper();

    const { result } = await renderHook(() => useMoodToday(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('useMoodHistory busca o histórico para o período informado', async () => {
    api.fetchMoodHistory.mockResolvedValue([entry]);
    const { wrapper } = makeWrapper();

    const { result } = await renderHook(() => useMoodHistory(30), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.fetchMoodHistory).toHaveBeenCalledWith(30);
    expect(result.current.data).toHaveLength(1);
  });

  it('useSubmitMood faz POST e invalida today + history', async () => {
    api.createMood.mockResolvedValue({ id: 'm2', score: 8, date: '2026-06-21' });
    const { client, wrapper } = makeWrapper();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = await renderHook(() => useSubmitMood(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ score: 8, factors: ['Sono'], notes: 'ok' });
    });

    expect(api.createMood.mock.calls[0][0]).toEqual({ score: 8, factors: ['Sono'], notes: 'ok' });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: moodKeys.today() });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: moodKeys.histories() });
  });

  it('useSubmitMood expõe erro 409 (já registrado hoje) ao consumidor', async () => {
    api.createMood.mockRejectedValue(new ApiError('conflict', 409, 'já registrado hoje'));
    const { wrapper } = makeWrapper();

    const { result } = await renderHook(() => useSubmitMood(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ score: 5, factors: [] }).catch(() => {});
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as ApiError).kind).toBe('conflict');
  });
});
