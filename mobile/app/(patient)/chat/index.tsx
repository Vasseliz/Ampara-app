import { useRouter } from 'expo-router';
import { ConversationsView } from '@/features/chat/screens/ConversationsView';

export default function ChatScreen() {
  const router = useRouter();
  return (
    <ConversationsView
      onOpenConversation={(conversation) =>
        router.push({
          pathname: '/(patient)/chat/[professionalId]',
          params: { professionalId: conversation.profissionalId },
        })
      }
    />
  );
}
