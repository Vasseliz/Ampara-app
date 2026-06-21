import type { ReactNode } from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppStateStatus } from 'react-native';

import { VaultView } from '../components/VaultView';
import { testIDs } from '@/shared/testing/testIDs';
import { createBiometricGate } from '../auth/biometricGate';
import { createLocalAuthenticationMock } from '@/test/mocks/native';
import type { AppStateLike } from '../hooks/useBiometricGate';
import * as vaultApi from '../api/vault.api';

jest.mock('../api/vault.api');
const api = jest.mocked(vaultApi);

function makeFakeAppState() {
  let listener: ((s: AppStateStatus) => void) | null = null;
  const appState: AppStateLike = {
    addEventListener: (_t, l) => {
      listener = l;
      return { remove: jest.fn() };
    },
  };
  return { appState, emit: (s: AppStateStatus) => listener?.(s) };
}

async function renderView(success = true, level = 3) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const gate = createBiometricGate(createLocalAuthenticationMock(success, level));
  const { appState, emit } = makeFakeAppState();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const utils = await render(<VaultView gateOptions={{ gate, appState }} />, { wrapper });
  return { ...utils, emit };
}

beforeEach(() => jest.clearAllMocks());

describe('Tela do Cofre', () => {
  it('inicia bloqueada: não renderiza conteúdo nem busca notas', async () => {
    api.fetchVaultNotes.mockResolvedValue([]);
    const { getByTestId, queryByTestId } = await renderView();

    expect(getByTestId(testIDs.vault.locked)).toBeTruthy();
    expect(queryByTestId(testIDs.vault.screen)).toBeNull();
    expect(api.fetchVaultNotes).not.toHaveBeenCalled();
  });

  it('após biometria com sucesso, exibe a lista de notas', async () => {
    api.fetchVaultNotes.mockResolvedValue([
      { id: '1', content: 'lembrete', createdAt: 'x' },
    ]);
    const { getByTestId } = await renderView(true);

    await fireEvent.press(getByTestId(testIDs.vault.unlock));

    await waitFor(() => expect(getByTestId(testIDs.vault.note('1'))).toBeTruthy());
  });

  it('criar nota a faz aparecer; excluir a remove', async () => {
    api.fetchVaultNotes
      .mockResolvedValueOnce([]) // após desbloqueio
      .mockResolvedValueOnce([{ id: '1', content: 'nova', createdAt: 'x' }]) // após criar
      .mockResolvedValueOnce([]); // após excluir
    api.createVaultNote.mockResolvedValue({ id: '1', content: 'nova', createdAt: 'x' });
    api.deleteVaultNote.mockResolvedValue(undefined);

    const { getByTestId, queryByTestId } = await renderView(true);
    await fireEvent.press(getByTestId(testIDs.vault.unlock));
    await waitFor(() => expect(getByTestId(testIDs.vault.empty)).toBeTruthy());

    await fireEvent.changeText(getByTestId(testIDs.vault.noteInput), 'nova');
    await fireEvent.press(getByTestId(testIDs.vault.add));
    await waitFor(() => expect(getByTestId(testIDs.vault.note('1'))).toBeTruthy());

    await fireEvent.press(getByTestId(testIDs.vault.deleteNote('1')));
    await waitFor(() => expect(queryByTestId(testIDs.vault.note('1'))).toBeNull());
  });

  it('sem PIN/biometria: abre direto e mostra aviso de segurança', async () => {
    api.fetchVaultNotes.mockResolvedValue([]);
    const { getByTestId } = await renderView(true, 0);

    await waitFor(() => expect(getByTestId(testIDs.vault.screen)).toBeTruthy());
    expect(getByTestId(testIDs.vault.insecureWarning)).toBeTruthy();
  });

  it('ao ir para background, oculta o conteúdo (re-gate)', async () => {
    api.fetchVaultNotes.mockResolvedValue([{ id: '1', content: 'a', createdAt: 'x' }]);
    const { getByTestId, queryByTestId, emit } = await renderView(true);

    await fireEvent.press(getByTestId(testIDs.vault.unlock));
    await waitFor(() => expect(getByTestId(testIDs.vault.screen)).toBeTruthy());

    await act(async () => {
      emit('background');
    });

    expect(queryByTestId(testIDs.vault.screen)).toBeNull();
    expect(getByTestId(testIDs.vault.locked)).toBeTruthy();
  });
});
