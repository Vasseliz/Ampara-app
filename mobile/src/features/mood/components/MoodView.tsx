import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Card, ScreenContainer, TextField } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import { ApiError } from '@/core/api';
import { useMoodToday } from '../hooks/useMoodToday';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { useSubmitMood } from '../hooks/useSubmitMood';
import { temRegistroHoje, type MoodFactor } from '../domain/mood';
import { MoodSlider } from './MoodSlider';
import { FactorChips } from './FactorChips';
import { MoodHistoryList } from './MoodHistoryList';

/** Período inicial do histórico (em dias) — espelha o default do backend. */
const DEFAULT_DAYS = 14;

/**
 * Conteúdo da tela de Humor. Renderizada pela rota `app/(patient)/humor.tsx`;
 * isolada em componente para ser testável sem importar o arquivo de rota.
 * Mostra o registro de hoje quando existe; senão, o formulário de registro.
 */
export function MoodView() {
  const today = useMoodToday();
  const [days, setDays] = useState(DEFAULT_DAYS);
  const history = useMoodHistory(days);
  const submit = useSubmitMood();

  const [score, setScore] = useState(5);
  const [factors, setFactors] = useState<MoodFactor[]>([]);
  const [notes, setNotes] = useState('');

  const hasToday = temRegistroHoje(today.data ?? null);

  function toggleFactor(factor: MoodFactor) {
    setFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor],
    );
  }

  function handleSubmit() {
    if (submit.isPending) return;
    submit.mutate({ score, factors, notes: notes.trim() ? notes.trim() : undefined });
  }

  return (
    <ScreenContainer testID={testIDs.mood.screen}>
      {hasToday ? (
        <Card testID={testIDs.mood.today}>
          <Text style={styles.title}>Humor de hoje</Text>
          <Text style={styles.score}>{today.data?.score}/10</Text>
          {today.data?.factors.length ? (
            <Text style={styles.muted}>{today.data.factors.join(', ')}</Text>
          ) : null}
          {today.data?.notes ? <Text style={styles.notes}>{today.data.notes}</Text> : null}
        </Card>
      ) : (
        <Card testID={testIDs.mood.form}>
          <MoodSlider value={score} onChange={setScore} />
          <FactorChips selected={factors} onToggle={toggleFactor} />
          <TextField
            label="Anotação (opcional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Como foi o seu dia?"
            testID={testIDs.mood.notes}
            accessibilityLabel="Anotação do humor"
          />
          {submit.isError ? (
            <Text testID={testIDs.mood.error} style={styles.error}>
              {submit.error instanceof ApiError && submit.error.kind === 'conflict'
                ? 'Você já registrou seu humor hoje.'
                : 'Não foi possível registrar. Tente novamente.'}
            </Text>
          ) : null}
          <Button
            label="Registrar humor"
            loading={submit.isPending}
            onPress={handleSubmit}
            testID={testIDs.mood.submit}
            accessibilityLabel="Registrar humor"
          />
        </Card>
      )}
      <MoodHistoryList entries={history.data ?? []} days={days} onChangeDays={setDays} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold, color: tokens.color.text },
  score: { fontSize: tokens.font.xl, fontWeight: tokens.font.weightBold, color: tokens.color.primary },
  muted: { fontSize: tokens.font.sm, color: tokens.color.muted },
  notes: { fontSize: tokens.font.md, color: tokens.color.text },
  error: { fontSize: tokens.font.sm, color: tokens.color.danger },
});
