import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppIcon, Card, PageIntro, ScreenContainer } from '@/shared/components';
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
      <PageIntro
        icon="habits"
        title="Hábitos"
        subtitle="Pequenos registros para acompanhar sua rotina de cuidado."
      />
      {hasToday ? (
        <Card testID={testIDs.habits.today}>
          <Text style={styles.title}>Resumo de hoje</Text>
          <View style={styles.metrics}>
            <View style={styles.metric}><AppIcon name="sleep" color={tokens.color.primary} /><Text style={styles.metricValue}>{today.data?.horasSono}h</Text><Text style={styles.metricLabel}>Sono</Text></View>
            <View style={styles.metric}><AppIcon name="water" color={tokens.color.primary} /><Text style={styles.metricValue}>{today.data?.agua}</Text><Text style={styles.metricLabel}>Água</Text></View>
            <View style={styles.metric}><AppIcon name="exercise" color={tokens.color.primary} /><Text style={styles.metricValue}>{today.data?.exercitou ? 'Sim' : 'Não'}</Text><Text style={styles.metricLabel}>Exercício</Text></View>
          </View>
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
  title: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  metrics: { flexDirection: 'row', gap: tokens.spacing.sm },
  metric: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: tokens.spacing.md, borderRadius: tokens.radius.md, backgroundColor: tokens.color.primarySoft },
  metricValue: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  metricLabel: { fontSize: 11, color: tokens.color.muted },
  muted: { fontSize: tokens.font.sm, color: tokens.color.muted },
});
