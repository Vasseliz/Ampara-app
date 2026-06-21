import type { ReactNode } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MoodView } from '../components/MoodView';
import { testIDs } from '@/shared/testing/testIDs';
import type { MoodEntry } from '../api/mood.schemas';
import * as moodApi from '../api/mood.api';

jest.mock('../api/mood.api');
const api = jest.mocked(moodApi);

function entry(over: Partial<MoodEntry> = {}): MoodEntry {
  return { id: 'm1', score: 7, factors: ['Sono'], notes: null, date: '2026-06-21', ...over };
}

async function renderView() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(<MoodView />, { wrapper });
}

beforeEach(() => jest.clearAllMocks());

describe('Tela de Humor', () => {
  it('sem registro hoje mostra o formulário; submit válido passa a mostrar o registro de hoje', async () => {
    api.fetchMoodToday.mockResolvedValueOnce(null).mockResolvedValue(entry({ score: 8 }));
    api.fetchMoodHistory.mockResolvedValue([]);
    api.createMood.mockResolvedValue({ id: 'm1', score: 8, date: '2026-06-21' });

    const { getByTestId, queryByTestId } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.mood.form)).toBeTruthy());

    await fireEvent.press(getByTestId(testIDs.mood.submit));

    await waitFor(() => expect(getByTestId(testIDs.mood.today)).toBeTruthy());
    expect(queryByTestId(testIDs.mood.form)).toBeNull();
    expect(api.createMood).toHaveBeenCalledTimes(1);
  });

  it('com registro hoje não mostra o formulário de novo registro', async () => {
    api.fetchMoodToday.mockResolvedValue(entry());
    api.fetchMoodHistory.mockResolvedValue([]);

    const { getByTestId, queryByTestId } = await renderView();

    await waitFor(() => expect(getByTestId(testIDs.mood.today)).toBeTruthy());
    expect(queryByTestId(testIDs.mood.form)).toBeNull();
  });

  it('trocar o período refaz o histórico com novos days', async () => {
    api.fetchMoodToday.mockResolvedValue(entry());
    api.fetchMoodHistory.mockResolvedValue([]);

    const { getByTestId } = await renderView();
    await waitFor(() => expect(api.fetchMoodHistory).toHaveBeenCalledWith(14));

    await fireEvent.press(getByTestId(testIDs.mood.period(30)));
    await waitFor(() => expect(api.fetchMoodHistory).toHaveBeenCalledWith(30));
  });

  it('histórico vazio mostra estado vazio', async () => {
    api.fetchMoodToday.mockResolvedValue(entry());
    api.fetchMoodHistory.mockResolvedValue([]);

    const { getByTestId } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.mood.historyEmpty)).toBeTruthy());
  });
});
