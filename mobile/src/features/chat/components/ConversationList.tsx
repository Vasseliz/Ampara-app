import { Pressable, StyleSheet, Text } from 'react-native';
import { Card } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import type { Conversation } from '../api/chat.schemas';

export interface ConversationListProps {
  conversations: Conversation[];
  onOpen: (conversation: Conversation) => void;
}

export function ConversationList({ conversations, onOpen }: ConversationListProps) {
  return (
    <>
      {conversations.map((conversation) => (
        <Pressable
          key={conversation.profissionalId}
          testID={testIDs.chat.conversation(conversation.profissionalId)}
          accessibilityRole="button"
          accessibilityLabel={`Conversa com ${conversation.contactName}`}
          onPress={() => onOpen(conversation)}
        >
          <Card>
            <Text style={styles.name}>{conversation.contactName}</Text>
            <Text style={styles.email}>{conversation.contactEmail}</Text>
          </Card>
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: tokens.font.md, fontWeight: tokens.font.weightMedium, color: tokens.color.text },
  email: { fontSize: tokens.font.sm, color: tokens.color.muted },
});
