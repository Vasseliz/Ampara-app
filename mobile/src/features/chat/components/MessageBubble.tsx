import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import type { ChatMessage } from '../domain/message';

export interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (message: ChatMessage) => void;
}

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const mine = message.enviadoPeloPaciente;
  const id = message.clientId ?? message.id;
  const failed = message.status === 'failed';

  return (
    <View
      testID={testIDs.chat.message(id)}
      style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}
    >
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
        <Text style={[styles.text, mine && styles.textMine]}>{message.content}</Text>
        {message.status === 'sending' ? <Text style={styles.meta}>Enviando…</Text> : null}
        {failed ? (
          <Pressable
            testID={testIDs.chat.retry(id)}
            accessibilityRole="button"
            accessibilityLabel="Reenviar mensagem"
            onPress={() => onRetry?.(message)}
          >
            <Text style={styles.retry}>Falha ao enviar. Tocar para reenviar.</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', marginVertical: tokens.spacing.xs },
  rowMine: { alignItems: 'flex-end' },
  rowTheirs: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%', borderRadius: tokens.radius.lg, padding: tokens.spacing.md, gap: tokens.spacing.xs },
  mine: { backgroundColor: tokens.color.primary },
  theirs: { backgroundColor: tokens.color.surface, borderWidth: 1, borderColor: tokens.color.border },
  text: { fontSize: tokens.font.md, color: tokens.color.text },
  textMine: { color: tokens.color.primaryText },
  meta: { fontSize: tokens.font.sm, color: tokens.color.muted },
  retry: { fontSize: tokens.font.sm, color: tokens.color.danger },
});
