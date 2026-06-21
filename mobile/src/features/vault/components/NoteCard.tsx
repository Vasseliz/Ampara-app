import { StyleSheet, Text } from 'react-native';
import { Button, Card } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import type { VaultNote } from '../api/vault.schemas';

export interface NoteCardProps {
  note: VaultNote;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

export function NoteCard({ note, onDelete, deleting }: NoteCardProps) {
  return (
    <Card testID={testIDs.vault.note(note.id)}>
      <Text style={styles.content}>{note.content}</Text>
      <Button
        label="Excluir"
        variant="ghost"
        loading={deleting}
        onPress={() => onDelete(note.id)}
        testID={testIDs.vault.deleteNote(note.id)}
        accessibilityLabel="Excluir nota"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { fontSize: tokens.font.md, color: tokens.color.text },
});
