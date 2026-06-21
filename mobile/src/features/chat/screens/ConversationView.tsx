import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import { useMessages } from '../hooks/useMessages';
import { useSendMessage } from '../hooks/useSendMessage';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import type { ChatMessage } from '../domain/message';

export interface ConversationViewProps {
  pacienteId: string;
  profissionalId: string;
}

/** Conversa. Renderizada pela rota `app/(patient)/chat/[professionalId].tsx`. */
export function ConversationView({ pacienteId, profissionalId }: ConversationViewProps) {
  const insets = useSafeAreaInsets();
  const { data = [] } = useMessages(pacienteId, profissionalId);
  const send = useSendMessage(pacienteId, profissionalId);

  // Histórico vem cronológico; a lista é invertida (mais recente embaixo).
  const inverted = [...data].reverse();

  const handleRetry = (message: ChatMessage) =>
    send.mutate({ content: message.content, clientId: message.clientId });

  return (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {data.length === 0 ? (
        <View style={styles.empty}>
          <Text testID={testIDs.chat.messagesEmpty} style={styles.muted}>
            Nenhuma mensagem ainda.
          </Text>
        </View>
      ) : (
        <FlatList
          testID={testIDs.chat.messages}
          data={inverted}
          inverted
          keyExtractor={(item) => item.clientId ?? item.id}
          renderItem={({ item }) => <MessageBubble message={item} onRetry={handleRetry} />}
          contentContainerStyle={styles.list}
        />
      )}
      <View style={{ paddingBottom: insets.bottom }}>
        <MessageInput onSend={(content) => send.mutate({ content })} sending={send.isPending} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: tokens.color.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: tokens.spacing.lg },
  muted: { fontSize: tokens.font.md, color: tokens.color.muted },
  list: { padding: tokens.spacing.md },
});
