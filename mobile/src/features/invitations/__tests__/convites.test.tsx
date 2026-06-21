import type { ReactNode } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '@/core/api';
import { testIDs } from '@/shared/testing/testIDs';
import { AcceptInviteByTokenView } from '../components/AcceptInviteByTokenView';
import { InvitationsView } from '../components/InvitationsView';
import * as invitationsApi from '../api/invitations.api';

jest.mock('../api/invitations.api');
const api = jest.mocked(invitationsApi);

const invitation = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  professionalName: 'Dra. Ana',
  professionalEmail: 'ana@example.com',
  sentAt: '2026-06-20T12:00:00Z',
  expiresAt: '2099-06-27T12:00:00Z',
};

function renderView(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(ui, { wrapper });
}

beforeEach(() => jest.clearAllMocks());

describe('Telas de Convites', () => {
  it('lista e aceita convite recebido', async () => {
    api.fetchReceivedInvitations.mockResolvedValue([invitation]);
    api.acceptInvitation.mockResolvedValue({
      professionalName: 'Dra. Ana',
      acceptedAt: '2026-06-21T12:00:00Z',
    });
    const { getByTestId } = await renderView(<InvitationsView />);
    await waitFor(() => expect(getByTestId(testIDs.invitations.item(invitation.id))).toBeTruthy());

    await fireEvent.press(getByTestId(testIDs.invitations.accept(invitation.id)));

    await waitFor(() => expect(api.acceptInvitation.mock.calls[0][0]).toBe(invitation.id));
    expect(getByTestId(testIDs.invitations.success)).toBeTruthy();
  });

  it('exibe convite expirado sem ação de aceite', async () => {
    api.fetchReceivedInvitations.mockResolvedValue([
      { ...invitation, expiresAt: '2020-06-20T12:00:00Z' },
    ]);
    const { getByTestId, queryByTestId } = await renderView(<InvitationsView />);

    await waitFor(() => expect(getByTestId(testIDs.invitations.item(invitation.id))).toBeTruthy());
    expect(queryByTestId(testIDs.invitations.accept(invitation.id))).toBeNull();
  });

  it('aceita convite por token válido', async () => {
    api.acceptInvitationByToken.mockResolvedValue({
      professionalName: 'Dra. Ana',
      redirectTo: '/login',
    });
    const token = '0123456789abcdef0123456789abcdef';
    const { getByTestId } = await renderView(<AcceptInviteByTokenView token={token} />);

    await fireEvent.press(getByTestId(testIDs.invitations.acceptToken));

    await waitFor(() => expect(api.acceptInvitationByToken.mock.calls[0][0]).toBe(token));
    expect(getByTestId(testIDs.invitations.tokenSuccess)).toBeTruthy();
  });

  it('mostra erro claro para token malformado ou expirado', async () => {
    const invalid = await renderView(<AcceptInviteByTokenView token="inválido" />);
    expect(invalid.getByTestId(testIDs.invitations.tokenError)).toBeTruthy();
    await invalid.unmount();

    api.acceptInvitationByToken.mockRejectedValue(new ApiError('gone', 410, 'expirado'));
    const expired = await renderView(
      <AcceptInviteByTokenView token="0123456789abcdef0123456789abcdef" />,
    );
    await fireEvent.press(expired.getByTestId(testIDs.invitations.acceptToken));
    await waitFor(() => expect(expired.getByTestId(testIDs.invitations.tokenError)).toBeTruthy());
  });

  it('não confunde falha ao listar com ausência de convites', async () => {
    api.fetchReceivedInvitations.mockRejectedValue(new Error('falha'));
    const { getByTestId, queryByTestId } = await renderView(<InvitationsView />);

    await waitFor(() => expect(getByTestId(testIDs.invitations.error)).toBeTruthy());
    expect(queryByTestId(testIDs.invitations.empty)).toBeNull();
  });
});
