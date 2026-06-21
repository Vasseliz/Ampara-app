import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/core/auth/useAuth';
import { ConversationView } from '@/features/chat/screens/ConversationView';

export default function ConversationScreen() {
  const { professionalId } = useLocalSearchParams<{ professionalId: string }>();
  const { state } = useAuth();
  const pacienteId = state.status === 'authenticated' ? state.user.id : '';

  return <ConversationView pacienteId={pacienteId} profissionalId={professionalId ?? ''} />;
}
