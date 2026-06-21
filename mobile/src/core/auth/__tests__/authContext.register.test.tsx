import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mocka a composição da camada de rede/sessão, preservando os erros tipados
// reais (ApiError) para o teste de 409.
jest.mock('../../api', () => {
  const errors = jest.requireActual('../../api/errors');
  return {
    ...errors,
    apiClient: { request: jest.fn() },
    authService: { signIn: jest.fn(), signOut: jest.fn(), refresh: jest.fn() },
    sessionStore: {
      getAccessToken: jest.fn(() => null),
      setAccessToken: jest.fn(),
      persistRefreshToken: jest.fn(async () => {}),
      getRefreshToken: jest.fn(async () => null),
      clear: jest.fn(async () => {}),
    },
  };
});

import { AuthProvider } from '../AuthContext';
import { useAuth } from '../useAuth';
import { apiClient, authService } from '../../api';
import { ApiError } from '../../api/errors';

const request = apiClient.request as jest.Mock;
const signIn = authService.signIn as jest.Mock;

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

beforeEach(() => jest.clearAllMocks());

describe('AuthContext.register', () => {
  it('cadastra via /auth/register e então autentica (auto-login)', async () => {
    request.mockImplementation((path: string) => {
      if (path === '/auth/register') return Promise.resolve({ message: 'ok' });
      if (path === '/auth/me') return Promise.resolve({ id: 'u1', role: 'patient' });
      return Promise.reject(new Error(`path inesperado: ${path}`));
    });
    signIn.mockResolvedValue({ accessToken: 'a', refreshToken: 'r' });

    const { result } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('unauthenticated'));

    await act(async () => {
      await result.current.register({
        firstName: 'Ana',
        lastName: 'Silva',
        email: ' ana@b.com ',
        password: '12345678',
      });
    });

    expect(request).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: {
        role: 'patient',
        firstName: 'Ana',
        lastName: 'Silva',
        email: 'ana@b.com',
        password: '12345678',
        registrationId: null,
      },
    });
    expect(signIn).toHaveBeenCalledWith('ana@b.com', '12345678');
    await waitFor(() => expect(result.current.state.status).toBe('authenticated'));
  });

  it('em 409 mostra "E-mail já cadastrado." e não autentica', async () => {
    request.mockImplementation((path: string) =>
      path === '/auth/register'
        ? Promise.reject(new ApiError('conflict', 409, 'dup'))
        : Promise.resolve({}),
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.state.status).toBe('unauthenticated'));

    await act(async () => {
      await result.current.register({
        firstName: 'Ana',
        lastName: 'Silva',
        email: 'ana@b.com',
        password: '12345678',
      });
    });

    expect(signIn).not.toHaveBeenCalled();
    expect(result.current.state).toEqual({ status: 'error', error: 'E-mail já cadastrado.' });
  });
});
