import { Text } from 'react-native';
import { ScreenContainer } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import { useConversations } from '../hooks/useConversations';
import { ConversationList } from '../components/ConversationList';
import type { Conversation } from '../api/chat.schemas';

export interface ConversationsViewProps {
  onOpenConversation: (conversation: Conversation) => void;
}

/** Lista de conversas. Renderizada pela rota `app/(patient)/chat/index.tsx`. */
export function ConversationsView({ onOpenConversation }: ConversationsViewProps) {
  const { data = [] } = useConversations();

  return (
    <ScreenContainer testID={testIDs.chat.conversations}>
      {data.length === 0 ? (
        <Text testID={testIDs.chat.conversationsEmpty} style={{ color: tokens.color.muted }}>
          Nenhuma conversa ainda.
        </Text>
      ) : (
        <ConversationList conversations={data} onOpen={onOpenConversation} />
      )}
    </ScreenContainer>
  );
}
