import { apiClient } from '@/core/api';
import {
  acceptInvitation,
  acceptInvitationByToken,
  fetchReceivedInvitations,
} from '../invitations.api';

jest.mock('@/core/api', () => ({
  apiClient: { request: jest.fn() },
}));

const request = jest.mocked(apiClient.request);
const id = '550e8400-e29b-41d4-a716-446655440000';
const token = '0123456789abcdef0123456789abcdef';

beforeEach(() => jest.clearAllMocks());

describe('API de Convites', () => {
  it('lista os convites recebidos', async () => {
    request.mockResolvedValue([]);
    await expect(fetchReceivedInvitations()).resolves.toEqual([]);
    expect(request).toHaveBeenCalledWith('/patients/invites/received');
  });

  it('aceita um convite autenticado', async () => {
    request.mockResolvedValue({
      professionalName: 'Dra. Ana',
      acceptedAt: '2026-06-21T12:00:00Z',
    });
    await acceptInvitation(id);

    expect(request).toHaveBeenCalledWith(`/patients/invites/${id}/accept`, {
      method: 'POST',
    });
  });

  it('aceita um convite pelo token do deep link', async () => {
    request.mockResolvedValue({ professionalName: 'Dra. Ana', redirectTo: '/login' });
    await acceptInvitationByToken(token);

    expect(request).toHaveBeenCalledWith('/patients/invite/accept', {
      method: 'POST',
      body: { token },
    });
  });
});
