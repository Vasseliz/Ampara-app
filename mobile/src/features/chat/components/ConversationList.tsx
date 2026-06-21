import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon, Card } from '@/shared/components';
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
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Card style={styles.card}>
            <View style={styles.avatar}><AppIcon name="person" color={tokens.color.primary} size={21} /></View>
            <View style={styles.copy}><Text style={styles.name}>{conversation.contactName}</Text><Text style={styles.email}>{conversation.contactEmail}</Text></View>
            <AppIcon name="chevron" color={tokens.color.muted} size={18} />
          </Card>
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.72 },
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm },
  avatar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radius.md, backgroundColor: tokens.color.primarySoft },
  copy: { flex: 1 },
  name: { fontSize: tokens.font.md, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  email: { fontSize: tokens.font.sm, color: tokens.color.muted },
});
