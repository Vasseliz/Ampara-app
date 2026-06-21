import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useHabitsToday } from '../useHabitsToday';
import { useSubmitHabits } from '../useSubmitHabits';
import { habitsKeys } from '../../api/habits.keys';
import type { CreateHabitsInput, RegisteredHabits } from '../../api/habits.schemas';
import * as habitsApi from '../../api/habits.api';

jest.mock('../../api/habits.api');
const api = jest.mocked(habitsApi);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

const entry = {
  id: 'h1',
  exercitou: true,
  horasSono: 8,
  qualidadeSono: 4,
  agua: 2,
  date: '2026-06-21',
};

const input: CreateHabitsInput = { exercitou: true, horasSono: 8, qualidadeSono: 4, agua: 2 };

beforeEach(() => jest.clearAllMocks());

describe('hooks de Hábitos', () => {
  it('useHabitsToday retorna o registro quando existe', async () => {
    api.fetchHabitsToday.mockResolvedValue(entry);
    const { wrapper } = makeWrapper();

    const { result } = await renderHook(() => useHabitsToday(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(entry);
  });

  it('useHabitsToday retorna null quando não há registro hoje', async () => {
    api.fetchHabitsToday.mockResolvedValue(null);
    const { wrapper } = makeWrapper();

    const { result } = await renderHook(() => useHabitsToday(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('useSubmitHabits durante o envio pendente ignora o segundo disparo (sem 2º POST)', async () => {
    let resolve: (value: RegisteredHabits) => void = () => {};
    api.createHabits.mockReturnValue(
      new Promise<RegisteredHabits>((res) => {
        resolve = res;
      }),
    );
    const { wrapper } = makeWrapper();

    const { result } = await renderHook(() => useSubmitHabits(), { wrapper });
    await act(async () => {
      result.current.submit(input);
      result.current.submit(input); // segundo toque enquanto o primeiro está em voo
    });

    expect(api.createHabits).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve({ id: 'h1', date: '2026-06-21' });
    });
  });

  it('useSubmitHabits OK invalida today + history', async () => {
    api.createHabits.mockResolvedValue({ id: 'h1', date: '2026-06-21' });
    const { client, wrapper } = makeWrapper();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = await renderHook(() => useSubmitHabits(), { wrapper });
    await act(async () => {
      result.current.submit(input);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.createHabits.mock.calls[0][0]).toEqual(input);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: habitsKeys.today() });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: habitsKeys.histories() });
  });
});
