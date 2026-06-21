import { StyleSheet, Text, View } from 'react-native';
import { AppIcon, Button, Card } from '@/shared/components';
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
      <View style={styles.heading}><AppIcon name="note" color={tokens.color.primary} size={20} /><Text style={styles.label}>NOTA PRIVADA</Text></View>
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
  heading: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm },
  label: { fontSize: 10, letterSpacing: 0.8, fontWeight: tokens.font.weightBold, color: tokens.color.muted },
  content: { fontSize: tokens.font.md, lineHeight: 22, color: tokens.color.text },
});
