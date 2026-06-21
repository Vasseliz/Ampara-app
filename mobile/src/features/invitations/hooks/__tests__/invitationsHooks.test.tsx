import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '@/core/api';
import { invitationKeys } from '../../api/invitations.keys';
import * as invitationsApi from '../../api/invitations.api';
import { useAcceptInvite } from '../useAcceptInvite';
import { useAcceptInviteByToken } from '../useAcceptInviteByToken';
import { useReceivedInvites } from '../useReceivedInvites';

jest.mock('../../api/invitations.api');
const api = jest.mocked(invitationsApi);

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

const invitation = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  professionalName: 'Dra. Ana',
  professionalEmail: 'ana@example.com',
  sentAt: '2026-06-20T12:00:00Z',
  expiresAt: '2026-06-27T12:00:00Z',
};

beforeEach(() => jest.clearAllMocks());

describe('hooks de Convites', () => {
  it('lista convites recebidos', async () => {
    api.fetchReceivedInvitations.mockResolvedValue([invitation]);
    const { wrapper } = setup();
    const { result } = await renderHook(() => useReceivedInvites(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([invitation]);
  });

  it('aceita convite e invalida a lista', async () => {
    api.acceptInvitation.mockResolvedValue({
      professionalName: 'Dra. Ana',
      acceptedAt: '2026-06-21T12:00:00Z',
    });
    const { client, wrapper } = setup();
    const invalidate = jest.spyOn(client, 'invalidateQueries');
    const { result } = await renderHook(() => useAcceptInvite(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(invitation.id);
    });

    expect(invalidate).toHaveBeenCalledWith({ queryKey: invitationKeys.received() });
  });

  it('aceita por token e expõe erro de token inválido', async () => {
    api.acceptInvitationByToken.mockRejectedValue(new ApiError('gone', 410, 'expirado'));
    const { wrapper } = setup();
    const { result } = await renderHook(() => useAcceptInviteByToken(), { wrapper });

    await act(async () => {
      await result.current
        .mutateAsync('0123456789abcdef0123456789abcdef')
        .catch(() => {});
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as ApiError).kind).toBe('gone');
  });
});
