import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import type { MoodEntry } from '../api/mood.schemas';

/** Períodos selecionáveis (em dias) para o histórico. */
export const MOOD_HISTORY_PERIODS = [7, 14, 30] as const;

export interface MoodHistoryListProps {
  entries: MoodEntry[];
  days: number;
  onChangeDays: (days: number) => void;
}

export function MoodHistoryList({ entries, days, onChangeDays }: MoodHistoryListProps) {
  return (
    <View style={styles.wrap} testID={testIDs.mood.history}>
      <Text style={styles.title}>Histórico</Text>
      <View style={styles.periods}>
        {MOOD_HISTORY_PERIODS.map((period) => {
          const active = period === days;
          return (
            <Pressable
              key={period}
              testID={testIDs.mood.period(period)}
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
        <Text testID={testIDs.mood.historyEmpty} style={styles.muted}>
          Sem registros no período.
        </Text>
      ) : (
        entries.map((entry) => (
          <Card key={entry.id} testID={testIDs.mood.historyItem(entry.id)}>
            <Text style={styles.entryScore}>Humor: {entry.score}/10</Text>
            <Text style={styles.muted}>
              {entry.date}
              {entry.factors.length ? ` · ${entry.factors.join(', ')}` : ''}
            </Text>
            {entry.notes ? <Text style={styles.notes}>{entry.notes}</Text> : null}
          </Card>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: tokens.spacing.sm },
  title: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold, color: tokens.color.text },
  periods: { flexDirection: 'row', gap: tokens.spacing.sm },
  period: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  periodActive: { backgroundColor: tokens.color.primary, borderColor: tokens.color.primary },
  periodText: { fontSize: tokens.font.sm, color: tokens.color.text },
  periodTextActive: { color: tokens.color.primaryText, fontWeight: tokens.font.weightMedium },
  entryScore: { fontSize: tokens.font.md, fontWeight: tokens.font.weightMedium, color: tokens.color.text },
  muted: { fontSize: tokens.font.sm, color: tokens.color.muted },
  notes: { fontSize: tokens.font.md, color: tokens.color.text },
});
