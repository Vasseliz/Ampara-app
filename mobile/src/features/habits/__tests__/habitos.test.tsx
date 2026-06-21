import type { ReactNode } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { HabitsView } from '../components/HabitsView';
import { testIDs } from '@/shared/testing/testIDs';
import type { CreateHabitsInput, HabitEntry } from '../api/habits.schemas';
import * as habitsApi from '../api/habits.api';

jest.mock('../api/habits.api');
const api = jest.mocked(habitsApi);

function entry(over: Partial<HabitEntry> = {}): HabitEntry {
  return {
    id: 'h1',
    exercitou: true,
    horasSono: 8,
    qualidadeSono: 4,
    agua: 2,
    date: '2026-06-21',
    ...over,
  };
}

async function renderView() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(<HabitsView />, { wrapper });
}

async function fillValid(getByTestId: (id: string) => unknown) {
  await fireEvent.changeText(getByTestId(testIDs.habits.sleepHours) as never, '8');
  await fireEvent.changeText(getByTestId(testIDs.habits.sleepQuality) as never, '4');
  await fireEvent.changeText(getByTestId(testIDs.habits.water) as never, '2');
}

beforeEach(() => jest.clearAllMocks());

describe('Tela de Hábitos', () => {
  it('com registro hoje mostra o resumo e não o formulário de novo registro', async () => {
    api.fetchHabitsToday.mockResolvedValue(entry());
    api.fetchHabitsHistory.mockResolvedValue([]);

    const { getByTestId, queryByTestId } = await renderView();

    await waitFor(() => expect(getByTestId(testIDs.habits.today)).toBeTruthy());
    expect(queryByTestId(testIDs.habits.form)).toBeNull();
    expect(queryByTestId(testIDs.habits.submit)).toBeNull();
  });

  it('sem registro hoje mostra o formulário e o submit válido registra', async () => {
    api.fetchHabitsToday.mockResolvedValue(null);
    api.fetchHabitsHistory.mockResolvedValue([]);
    api.createHabits.mockResolvedValue({ id: 'h1', date: '2026-06-21' });

    const { getByTestId } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.habits.form)).toBeTruthy());

    await fillValid(getByTestId);
    await fireEvent.press(getByTestId(testIDs.habits.submit));

    const expected: CreateHabitsInput = {
      exercitou: false,
      horasSono: 8,
      qualidadeSono: 4,
      agua: 2,
    };
    await waitFor(() => expect(api.createHabits).toHaveBeenCalledTimes(1));
    expect(api.createHabits.mock.calls[0][0]).toEqual(expected);
  });

  it('toque duplo no salvar dispara apenas um envio', async () => {
    api.fetchHabitsToday.mockResolvedValue(null);
    api.fetchHabitsHistory.mockResolvedValue([]);
    api.createHabits.mockResolvedValue({ id: 'h1', date: '2026-06-21' });

    const { getByTestId } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.habits.form)).toBeTruthy());

    await fillValid(getByTestId);
    // Dois toques no mesmo tick — o guard de envio em voo deve ignorar o segundo.
    const submitBtn = getByTestId(testIDs.habits.submit);
    fireEvent.press(submitBtn);
    fireEvent.press(submitBtn);

    await waitFor(() => expect(api.createHabits).toHaveBeenCalledTimes(1));
  });

  it('campo numérico ignora caracteres não numéricos', async () => {
    api.fetchHabitsToday.mockResolvedValue(null);
    api.fetchHabitsHistory.mockResolvedValue([]);

    const { getByTestId } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.habits.form)).toBeTruthy());

    await fireEvent.changeText(getByTestId(testIDs.habits.water), 'a3b');
    expect(getByTestId(testIDs.habits.water).props.value).toBe('3');
  });

  it('valor fora de faixa bloqueia o envio com feedback', async () => {
    api.fetchHabitsToday.mockResolvedValue(null);
    api.fetchHabitsHistory.mockResolvedValue([]);
    api.createHabits.mockResolvedValue({ id: 'h1', date: '2026-06-21' });

    const { getByTestId, queryByTestId } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.habits.form)).toBeTruthy());

    await fireEvent.changeText(getByTestId(testIDs.habits.sleepHours), '20');
    await fireEvent.changeText(getByTestId(testIDs.habits.sleepQuality), '3');
    await fireEvent.changeText(getByTestId(testIDs.habits.water), '2');
    await fireEvent.press(getByTestId(testIDs.habits.submit));

    expect(getByTestId(testIDs.habits.error)).toBeTruthy();
    expect(api.createHabits).not.toHaveBeenCalled();

    await fireEvent.changeText(getByTestId(testIDs.habits.sleepHours), '8');
    await fireEvent.press(getByTestId(testIDs.habits.submit));

    await waitFor(() => expect(api.createHabits).toHaveBeenCalledTimes(1));
    expect(queryByTestId(testIDs.habits.error)).toBeNull();
  });

  it('histórico vazio mostra o estado vazio', async () => {
    api.fetchHabitsToday.mockResolvedValue(null);
    api.fetchHabitsHistory.mockResolvedValue([]);

    const { getByTestId } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.habits.historyEmpty)).toBeTruthy());
  });
});
