import { z } from 'zod';

const dateTimeSchema = z.string().datetime({ offset: true });

export const invitationSchema = z.object({
  id: z.uuid(),
  professionalName: z.string().trim().min(1),
  professionalEmail: z.email(),
  sentAt: dateTimeSchema,
  expiresAt: dateTimeSchema,
});

export const receivedInvitationsSchema = z.array(invitationSchema);

export const acceptInvitationResponseSchema = z.object({
  professionalName: z.string().trim().min(1),
  acceptedAt: dateTimeSchema,
});

export const acceptInvitationByTokenResponseSchema = z.object({
  professionalName: z.string().trim().min(1),
  redirectTo: z.string(),
});

export type AcceptInvitationResponse = z.infer<typeof acceptInvitationResponseSchema>;
export type AcceptInvitationByTokenResponse = z.infer<typeof acceptInvitationByTokenResponseSchema>;
