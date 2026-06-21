import type { ReactNode } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '@/core/api';
import { testIDs } from '@/shared/testing/testIDs';
import { MedicationsView } from '../components/MedicationsView';
import * as medicationsApi from '../api/medications.api';

jest.mock('../api/medications.api');
const api = jest.mocked(medicationsApi);

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const gesture = {
    enabled: () => gesture,
    activeOffsetX: () => gesture,
    failOffsetY: () => gesture,
    onUpdate: () => gesture,
    onEnd: () => gesture,
  };
  return {
    Gesture: { Pan: () => gesture },
    GestureDetector: ({ children }: { children: ReactNode }) => children,
  };
});

jest.mock('react-native-reanimated', () => {
  const ReactNative = require('react-native');
  return {
    __esModule: true,
    default: { View: ReactNative.View },
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    useAnimatedStyle: (fn: () => unknown) => fn(),
    useSharedValue: (value: number) => ({ value }),
    withSpring: (value: number) => value,
  };
});

const medication = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Losartana',
  dosage: '50 mg',
  time: '08:00',
  taken: false,
  observation: null,
  active: true,
};

function renderView() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(<MedicationsView />, { wrapper });
}

beforeEach(() => {
  jest.clearAllMocks();
  api.fetchTodayMedications.mockResolvedValue([medication]);
  api.fetchMedicationAdherence.mockResolvedValue({
    data: [{ day: 21, date: '2026-06-21', value: 50 }],
    averageAdherence: 50,
  });
});

describe('Tela de Medicamentos', () => {
  it('renderiza medicamentos e adesão', async () => {
    const { getByTestId, getByText } = await renderView();

    await waitFor(() => expect(getByTestId(testIDs.medications.item(medication.id))).toBeTruthy());
    expect(getByText('Losartana')).toBeTruthy();
    expect(getByTestId(testIDs.medications.adherence)).toBeTruthy();
  });

  it('registra tomada pela ação acessível', async () => {
    api.takeMedication.mockResolvedValue({ taken: true, takenAt: '2026-06-21T12:00:00Z' });
    const { getByTestId } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.medications.take(medication.id))).toBeTruthy());

    await fireEvent.press(getByTestId(testIDs.medications.take(medication.id)));
    await waitFor(() => expect(api.takeMedication.mock.calls[0][0]).toBe(medication.id));
  });

  it('mostra erro e não marca localmente em falha de rede', async () => {
    api.takeMedication.mockRejectedValue(new ApiError('network', 0, 'offline'));
    const { getByTestId, getByText } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.medications.take(medication.id))).toBeTruthy());

    await fireEvent.press(getByTestId(testIDs.medications.take(medication.id)));

    await waitFor(() => expect(getByTestId(testIDs.medications.error)).toBeTruthy());
    expect(getByText('Pendente')).toBeTruthy();
  });

  it('revalida lista e adesão no pull-to-refresh', async () => {
    const { getByTestId } = await renderView();
    await waitFor(() => expect(getByTestId(testIDs.medications.list)).toBeTruthy());

    await getByTestId(testIDs.medications.list).props.refreshControl.props.onRefresh();

    await waitFor(() => expect(api.fetchTodayMedications).toHaveBeenCalledTimes(2));
    expect(api.fetchMedicationAdherence).toHaveBeenCalledTimes(2);
  });

  it('mostra estado vazio da adesão', async () => {
    api.fetchMedicationAdherence.mockResolvedValue({ data: [], averageAdherence: 0 });
    const { getByTestId } = await renderView();

    await waitFor(() => expect(getByTestId(testIDs.medications.adherenceEmpty)).toBeTruthy());
  });

  it('diferencia erro de carregamento de estado vazio', async () => {
    api.fetchTodayMedications.mockRejectedValue(new Error('falha'));
    api.fetchMedicationAdherence.mockRejectedValue(new Error('falha'));
    const { getByTestId, queryByTestId } = await renderView();

    await waitFor(() => expect(getByTestId(testIDs.medications.error)).toBeTruthy());
    expect(getByTestId(testIDs.medications.adherenceError)).toBeTruthy();
    expect(queryByTestId(testIDs.medications.empty)).toBeNull();
    expect(queryByTestId(testIDs.medications.adherenceEmpty)).toBeNull();
  });
});
