import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptInvitation } from '../api/invitations.api';
import { invitationKeys } from '../api/invitations.keys';

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invitationKeys.received() }),
  });
}
