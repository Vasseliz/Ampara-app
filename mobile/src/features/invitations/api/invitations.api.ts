import { apiClient } from '@/core/api';
import type { Invitation } from '../domain/invite';
import {
  acceptInvitationByTokenResponseSchema,
  acceptInvitationResponseSchema,
  receivedInvitationsSchema,
  type AcceptInvitationByTokenResponse,
  type AcceptInvitationResponse,
} from './invitations.schemas';

export async function fetchReceivedInvitations(): Promise<Invitation[]> {
  const data = await apiClient.request<unknown>('/patients/invites/received');
  return receivedInvitationsSchema.parse(data);
}

export async function acceptInvitation(id: string): Promise<AcceptInvitationResponse> {
  const data = await apiClient.request<unknown>(`/patients/invites/${id}/accept`, {
    method: 'POST',
  });
  return acceptInvitationResponseSchema.parse(data);
}

export async function acceptInvitationByToken(
  token: string,
): Promise<AcceptInvitationByTokenResponse> {
  const data = await apiClient.request<unknown>('/patients/invite/accept', {
    method: 'POST',
    body: { token },
  });
  return acceptInvitationByTokenResponseSchema.parse(data);
}
