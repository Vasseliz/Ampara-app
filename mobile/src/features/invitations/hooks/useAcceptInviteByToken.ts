import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptInvitationByToken } from '../api/invitations.api';
import { invitationKeys } from '../api/invitations.keys';

export function useAcceptInviteByToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptInvitationByToken,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invitationKeys.received() }),
  });
}
