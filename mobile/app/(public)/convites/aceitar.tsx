import { useLocalSearchParams } from 'expo-router';
import { AcceptInviteByTokenView } from '@/features/invitations/components/AcceptInviteByTokenView';

/**
 * Rota pública porque o endpoint de aceite por token não exige sessão e o
 * deep link deve funcionar com o app fechado ou com o paciente deslogado.
 */
export default function AcceptInvitationScreen() {
  const { token } = useLocalSearchParams<{ token?: string | string[] }>();
  return <AcceptInviteByTokenView token={token} />;
}
