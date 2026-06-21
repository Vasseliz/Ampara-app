import { useQuery } from '@tanstack/react-query';
import { fetchReceivedInvitations } from '../api/invitations.api';
import { invitationKeys } from '../api/invitations.keys';

export function useReceivedInvites() {
  return useQuery({
    queryKey: invitationKeys.received(),
    queryFn: fetchReceivedInvitations,
  });
}
