import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, ScreenContainer } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import { useBiometricGate, type UseBiometricGateOptions } from '../hooks/useBiometricGate';
import { useVaultNotes } from '../hooks/useVaultNotes';
import { useCreateNote } from '../hooks/useCreateNote';
import { useDeleteNote } from '../hooks/useDeleteNote';
import { NoteCard } from './NoteCard';
import { NoteForm } from './NoteForm';

/**
 * Conteúdo do Cofre. Renderizado pela rota `app/(patient)/cofre.tsx`; isolado
 * em componente para ser testável sem importar o arquivo de rota.
 *
 * O conteúdo das notas só é montado quando `status === 'unlocked'`. Ao ir para
 * background o gate volta a `locked` e este bloco desmonta, ocultando o
 * conteúdo sensível (re-gate ao retornar). Quando o aparelho não tem biometria
 * nem PIN (`level === 'none'`) o gate libera e exibimos um aviso de segurança.
 * `gateOptions` permite injeção em teste.
 */
export interface VaultViewProps {
  gateOptions?: UseBiometricGateOptions;
}

export function VaultView({ gateOptions }: VaultViewProps) {
  const gate = useBiometricGate(gateOptions);
  const unlocked = gate.status === 'unlocked';

  const notes = useVaultNotes(unlocked);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  if (!unlocked) {
    const label =
      gate.level === 'credential' ? 'Desbloquear com PIN' : 'Desbloquear com biometria';
    return (
      <ScreenContainer scroll={false} testID={testIDs.vault.locked}>
        <Card>
          <Text style={styles.title}>Cofre bloqueado</Text>
          <Button
            label={label}
            loading={gate.authenticating}
            onPress={gate.unlock}
            testID={testIDs.vault.unlock}
            accessibilityLabel="Desbloquear o Cofre"
          />
        </Card>
      </ScreenContainer>
    );
  }

  const data = notes.data ?? [];

  return (
    <ScreenContainer testID={testIDs.vault.screen}>
      {gate.level === 'none' ? (
        <Card testID={testIDs.vault.insecureWarning} style={styles.warning}>
          <Text style={styles.warningText}>
            Seu aparelho não tem PIN nem biometria. Configure um bloqueio de tela para proteger
            o conteúdo do Cofre.
          </Text>
        </Card>
      ) : null}
      <NoteForm onSubmit={(content) => createNote.mutate({ content })} submitting={createNote.isPending} />
      <View testID={testIDs.vault.list} style={styles.list}>
        {data.length === 0 ? (
          <Text testID={testIDs.vault.empty} style={styles.muted}>
            Nenhuma nota ainda.
          </Text>
        ) : (
          data.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={(id) => deleteNote.mutate(id)}
              deleting={deleteNote.isPending && deleteNote.variables === note.id}
            />
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold, color: tokens.color.text },
  muted: { fontSize: tokens.font.md, color: tokens.color.muted },
  list: { gap: tokens.spacing.md },
  warning: { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' },
  warningText: { fontSize: tokens.font.sm, color: '#92400E' },
});
