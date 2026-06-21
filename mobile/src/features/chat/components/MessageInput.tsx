import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import { MAX_MESSAGE_LENGTH, isValidMessageContent, normalizeMessageContent } from '../domain/message';

export interface MessageInputProps {
  onSend: (content: string) => void;
  sending?: boolean;
}

export function MessageInput({ onSend, sending }: MessageInputProps) {
  const [content, setContent] = useState('');
  const valid = isValidMessageContent(content);

  function handleSend() {
    if (!valid) return;
    onSend(normalizeMessageContent(content));
    setContent('');
  }

  return (
    <View style={styles.row}>
      <TextInput
        testID={testIDs.chat.input}
        accessibilityLabel="Mensagem"
        value={content}
        onChangeText={setContent}
        placeholder="Mensagem"
        placeholderTextColor={tokens.color.muted}
        maxLength={MAX_MESSAGE_LENGTH}
        multiline
        style={styles.input}
      />
      <Button
        label="Enviar"
        disabled={!valid}
        loading={sending}
        onPress={handleSend}
        testID={testIDs.chat.send}
        accessibilityLabel="Enviar mensagem"
        style={styles.send}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.surface,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    fontSize: tokens.font.md,
    color: tokens.color.text,
    backgroundColor: tokens.color.background,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
  },
  send: { paddingHorizontal: tokens.spacing.md },
});
