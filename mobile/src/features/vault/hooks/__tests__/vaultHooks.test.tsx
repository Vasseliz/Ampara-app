import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppStateStatus } from 'react-native';

import { useVaultNotes } from '../useVaultNotes';
import { useCreateNote } from '../useCreateNote';
import { useDeleteNote } from '../useDeleteNote';
import { useBiometricGate, type AppStateLike } from '../useBiometricGate';
import { vaultKeys } from '../../api/vault.keys';
import { createLocalAuthenticationMock } from '@/test/mocks/native';
import { createBiometricGate } from '../../auth/biometricGate';
import * as vaultApi from '../../api/vault.api';

jest.mock('../../api/vault.api');
const api = jest.mocked(vaultApi);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

/** AppState fake que guarda o listener para o teste disparar mudanças. */
function makeFakeAppState() {
  let listener: ((s: AppStateStatus) => void) | null = null;
  const appState: AppStateLike = {
    addEventListener: (_type, l) => {
      listener = l;
      return { remove: jest.fn() };
    },
  };
  return { appState, emit: (s: AppStateStatus) => listener?.(s) };
}

beforeEach(() => jest.clearAllMocks());

describe('hooks CRUD do Cofre', () => {
  it('useVaultNotes lista as notas', async () => {
    api.fetchVaultNotes.mockResolvedValue([
      { id: '1', content: 'a', createdAt: '2026-06-21T10:00:00Z' },
    ]);
    const { wrapper } = makeWrapper();

    const { result } = await renderHook(() => useVaultNotes(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  it('useVaultNotes não busca quando enabled=false (gate bloqueado)', async () => {
    const { wrapper } = makeWrapper();
    await renderHook(() => useVaultNotes(false), { wrapper });
    expect(api.fetchVaultNotes).not.toHaveBeenCalled();
  });

  it('useCreateNote cria e invalida a lista', async () => {
    api.createVaultNote.mockResolvedValue({ id: '2', content: 'nova', createdAt: 'x' });
    const { client, wrapper } = makeWrapper();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = await renderHook(() => useCreateNote(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ content: 'nova' });
    });

    expect(api.createVaultNote.mock.calls[0][0]).toEqual({ content: 'nova' });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: vaultKeys.notes() });
  });

  it('useDeleteNote exclui e invalida a lista', async () => {
    api.deleteVaultNote.mockResolvedValue(undefined);
    const { client, wrapper } = makeWrapper();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = await renderHook(() => useDeleteNote(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(api.deleteVaultNote.mock.calls[0][0]).toBe('1');
    expect(invalidate).toHaveBeenCalledWith({ queryKey: vaultKeys.notes() });
  });
});

describe('useBiometricGate', () => {
  it('inicia bloqueado e desbloqueia em biometria com sucesso', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(true));
    const { appState } = makeFakeAppState();

    const { result } = await renderHook(() => useBiometricGate({ gate, appState }));
    expect(result.current.status).toBe('locked');

    await act(async () => {
      await result.current.unlock();
    });
    expect(result.current.status).toBe('unlocked');
  });

  it('permanece bloqueado quando a biometria falha/cancela', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(false));
    const { appState } = makeFakeAppState();

    const { result } = await renderHook(() => useBiometricGate({ gate, appState }));
    await act(async () => {
      await result.current.unlock();
    });
    expect(result.current.status).toBe('locked');
  });

  it('re-bloqueia ao ir para background (re-gate ao voltar)', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(true));
    const { appState, emit } = makeFakeAppState();

    const { result } = await renderHook(() => useBiometricGate({ gate, appState }));
    await act(async () => {
      await result.current.unlock();
    });
    expect(result.current.status).toBe('unlocked');

    await act(async () => {
      emit('background');
    });
    expect(result.current.status).toBe('locked');
  });

  it('resolve o nível de autenticação do dispositivo', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(true, 3));
    const { appState } = makeFakeAppState();

    const { result } = await renderHook(() => useBiometricGate({ gate, appState }));
    await waitFor(() => expect(result.current?.level).toBe('biometric'));
  });

  it('com só PIN (credential) permanece bloqueado até autenticar', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(true, 1));
    const { appState } = makeFakeAppState();

    const { result } = await renderHook(() => useBiometricGate({ gate, appState }));
    await waitFor(() => expect(result.current?.level).toBe('credential'));
    expect(result.current.status).toBe('locked');

    await act(async () => {
      await result.current.unlock();
    });
    expect(result.current.status).toBe('unlocked');
  });

  it('sem bloqueio de tela (none) libera automaticamente (não trava)', async () => {
    const gate = createBiometricGate(createLocalAuthenticationMock(true, 0));
    const { appState } = makeFakeAppState();

    const { result } = await renderHook(() => useBiometricGate({ gate, appState }));
    await waitFor(() => expect(result.current.status).toBe('unlocked'));
    expect(result.current.level).toBe('none');
  });

  it('trata módulo nativo indisponível como none e não trava (sem crash)', async () => {
    const gate = {
      level: jest.fn(async () => {
        throw new Error('unavailable');
      }),
      authenticate: jest.fn(async () => false),
    };
    const { appState } = makeFakeAppState();

    const { result } = await renderHook(() => useBiometricGate({ gate, appState }));
    await waitFor(() => expect(result.current.status).toBe('unlocked'));
    expect(result.current.level).toBe('none');
  });
});
