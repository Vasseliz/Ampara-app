import { StyleSheet, Text, View } from 'react-native';
import { AppIcon, Button, Card, PageIntro, ScreenContainer } from '@/shared/components';
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
        <View style={styles.lockedWrap}>
        <View style={styles.lockIcon}><AppIcon name="vault" color={tokens.color.primary} size={34} /></View>
        <Card style={styles.lockedCard}>
          <Text style={styles.title}>Seu Cofre está protegido</Text>
          <Text style={styles.muted}>Desbloqueie para acessar suas notas privadas.</Text>
          <Button
            label={label}
            loading={gate.authenticating}
            onPress={gate.unlock}
            testID={testIDs.vault.unlock}
            accessibilityLabel="Desbloquear o Cofre"
          />
        </Card>
        </View>
      </ScreenContainer>
    );
  }

  const data = notes.data ?? [];

  return (
    <ScreenContainer testID={testIDs.vault.screen}>
      <PageIntro icon="vault" title="Cofre" subtitle="Um espaço privado para pensamentos e anotações." />
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
  lockedWrap: { flex: 1, justifyContent: 'center', gap: tokens.spacing.lg },
  lockIcon: { width: 76, height: 76, alignSelf: 'center', borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.color.primarySoft },
  lockedCard: { padding: tokens.spacing.lg },
  title: { fontSize: tokens.font.xl, textAlign: 'center', fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  muted: { fontSize: tokens.font.md, color: tokens.color.muted },
  list: { gap: tokens.spacing.md },
  warning: { backgroundColor: tokens.color.warningSoft, borderColor: '#F6C98B' },
  warningText: { fontSize: tokens.font.sm, color: tokens.color.warning },
});
