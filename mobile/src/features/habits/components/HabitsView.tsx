import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card, ScreenContainer } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import { temRegistroHoje } from '../domain/habits';
import { useHabitsToday } from '../hooks/useHabitsToday';
import { useHabitsHistory } from '../hooks/useHabitsHistory';
import { useSubmitHabits } from '../hooks/useSubmitHabits';
import { HabitsForm } from './HabitsForm';
import { HabitsHistoryList } from './HabitsHistoryList';

/** Período inicial do histórico (em dias) — espelha o default do backend. */
const DEFAULT_DAYS = 14;

/**
 * Conteúdo da tela de Hábitos. Renderizada pela rota `app/(patient)/habitos.tsx`;
 * isolada em componente para ser testável sem importar o arquivo de rota.
 * Mostra o resumo de hoje quando já há registro (sem formulário — o paciente
 * registra uma vez por dia); senão, o formulário de registro.
 */
export function HabitsView() {
  const today = useHabitsToday();
  const [days, setDays] = useState(DEFAULT_DAYS);
  const history = useHabitsHistory(days);
  const submit = useSubmitHabits();

  const hasToday = temRegistroHoje(today.data ?? null);

  return (
    <ScreenContainer testID={testIDs.habits.screen}>
      {hasToday ? (
        <Card testID={testIDs.habits.today}>
          <Text style={styles.title}>Hábitos de hoje</Text>
          <Text style={styles.line}>
            Sono: {today.data?.horasSono}h · qualidade {today.data?.qualidadeSono}/5
          </Text>
          <Text style={styles.line}>Água: {today.data?.agua}</Text>
          <Text style={styles.line}>
            {today.data?.exercitou ? 'Exercitou-se hoje' : 'Sem exercício hoje'}
          </Text>
          <Text style={styles.muted}>Você já registrou seus hábitos hoje.</Text>
        </Card>
      ) : (
        <HabitsForm submitting={submit.isPending} onSubmit={submit.submit} />
      )}
      <HabitsHistoryList entries={history.data ?? []} days={days} onChangeDays={setDays} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold, color: tokens.color.text },
  line: { fontSize: tokens.font.md, color: tokens.color.text },
  muted: { fontSize: tokens.font.sm, color: tokens.color.muted },
});
