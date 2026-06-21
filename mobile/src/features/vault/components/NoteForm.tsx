import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextField } from '@/shared/components';
import { testIDs } from '@/shared/testing/testIDs';
import { tokens } from '@/shared/theme/tokens';
import { isValidNoteContent, normalizeNoteContent } from '../domain/vault';

export interface NoteFormProps {
  onSubmit: (content: string) => void;
  submitting?: boolean;
}

export function NoteForm({ onSubmit, submitting }: NoteFormProps) {
  const [content, setContent] = useState('');
  const valid = isValidNoteContent(content);

  function handleSubmit() {
    if (!valid) return;
    onSubmit(normalizeNoteContent(content));
    setContent('');
  }

  return (
    <View style={styles.wrap}>
      <TextField
        label="Nova nota"
        value={content}
        onChangeText={setContent}
        placeholder="Escreva uma nota privada"
        testID={testIDs.vault.noteInput}
        accessibilityLabel="Conteúdo da nova nota"
      />
      <Button
        label="Adicionar"
        disabled={!valid}
        loading={submitting}
        onPress={handleSubmit}
        testID={testIDs.vault.add}
        accessibilityLabel="Adicionar nota"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: tokens.spacing.sm, padding: tokens.spacing.md, borderRadius: tokens.radius.lg, backgroundColor: tokens.color.surface, ...tokens.shadow.card },
});
