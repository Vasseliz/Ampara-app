import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon, Card } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import type { HabitEntry } from '../api/habits.schemas';

/** Períodos selecionáveis (em dias) para o histórico. */
export const HABITS_HISTORY_PERIODS = [7, 14, 30] as const;

export interface HabitsHistoryListProps {
  entries: HabitEntry[];
  days: number;
  onChangeDays: (days: number) => void;
}

export function HabitsHistoryList({ entries, days, onChangeDays }: HabitsHistoryListProps) {
  return (
    <View style={styles.wrap} testID={testIDs.habits.history}>
      <View style={styles.heading}><AppIcon name="history" color={tokens.color.primary} size={20} /><Text style={styles.title}>Histórico</Text></View>
      <View style={styles.periods}>
        {HABITS_HISTORY_PERIODS.map((period) => {
          const active = period === days;
          return (
            <Pressable
              key={period}
              testID={testIDs.habits.period(period)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Período de ${period} dias`}
              onPress={() => onChangeDays(period)}
              style={[styles.period, active && styles.periodActive]}
            >
              <Text style={[styles.periodText, active && styles.periodTextActive]}>{period}d</Text>
            </Pressable>
          );
        })}
      </View>
      {entries.length === 0 ? (
        <Text testID={testIDs.habits.historyEmpty} style={styles.muted}>
          Sem registros no período.
        </Text>
      ) : (
        entries.map((entry) => (
          <Card key={entry.id} testID={testIDs.habits.historyItem(entry.id)}>
            <Text style={styles.entryTitle}>{entry.date}</Text>
            <Text style={styles.muted}>
              Sono {entry.horasSono}h · qualidade {entry.qualidadeSono}/5 · água {entry.agua} ·{' '}
              {entry.exercitou ? 'exercitou' : 'sem exercício'}
            </Text>
          </Card>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: tokens.spacing.sm },
  heading: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm },
  title: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  periods: { flexDirection: 'row', gap: tokens.spacing.sm },
  period: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  periodActive: { backgroundColor: tokens.color.primarySoft, borderColor: tokens.color.primary },
  periodText: { fontSize: tokens.font.sm, color: tokens.color.text },
  periodTextActive: { color: tokens.color.primaryDark, fontWeight: tokens.font.weightBold },
  entryTitle: { fontSize: tokens.font.md, fontWeight: tokens.font.weightMedium, color: tokens.color.text },
  muted: { fontSize: tokens.font.sm, color: tokens.color.muted },
});
