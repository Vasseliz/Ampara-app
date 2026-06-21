import { StyleSheet, Text, View } from 'react-native';
import { AppIcon, Card } from '@/shared/components';
import { testIDs } from '@/shared/testing/testIDs';
import { tokens } from '@/shared/theme/tokens';
import type { NormalizedAdherence } from '../domain/medication.types';

interface AdherenceChartProps {
  adherence?: NormalizedAdherence;
  loading?: boolean;
  error?: boolean;
}

function dayLabel(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    timeZone: 'UTC',
  })
    .format(new Date(`${date}T00:00:00.000Z`))
    .replace('.', '');
}

export function AdherenceChart({ adherence, loading, error }: AdherenceChartProps) {
  const hasData = Boolean(adherence?.data.some((point) => point.value !== null));

  return (
    <Card testID={testIDs.medications.adherence}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <AppIcon name="history" color={tokens.color.primary} size={20} />
          <Text style={styles.title}>Adesão nos últimos 7 dias</Text>
        </View>
        {hasData ? (
          <Text style={styles.average}>{adherence?.averageAdherence}%</Text>
        ) : null}
      </View>

      {loading ? (
        <Text style={styles.muted}>Carregando adesão...</Text>
      ) : error ? (
        <Text testID={testIDs.medications.adherenceError} style={styles.error}>
          Não foi possível carregar a adesão.
        </Text>
      ) : !hasData ? (
        <Text testID={testIDs.medications.adherenceEmpty} style={styles.muted}>
          Ainda não há dados de adesão.
        </Text>
      ) : (
        <View accessibilityLabel={`Adesão média de ${adherence?.averageAdherence}%`} style={styles.chart}>
          {adherence?.data.map((point) => {
            const value = point.value ?? 0;
            return (
              <View key={point.date} style={styles.column}>
                <Text style={styles.value}>{point.value === null ? '—' : `${point.value}%`}</Text>
                <View style={styles.track}>
                  {point.value !== null && value > 0 ? (
                    <View style={[styles.bar, { height: `${value}%` }]} />
                  ) : null}
                </View>
                <Text style={styles.day}>{dayLabel(point.date)}</Text>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: tokens.spacing.sm },
  heading: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm },
  title: { flex: 1, color: tokens.color.textStrong, fontSize: tokens.font.md, fontWeight: tokens.font.weightBold },
  average: { color: tokens.color.primaryDark, fontSize: tokens.font.xl, fontWeight: tokens.font.weightBold },
  muted: { color: tokens.color.muted, fontSize: tokens.font.md },
  error: { color: tokens.color.danger, fontSize: tokens.font.md },
  chart: { height: 180, flexDirection: 'row', alignItems: 'flex-end', gap: tokens.spacing.xs },
  column: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: tokens.spacing.xs },
  value: { color: tokens.color.muted, fontSize: 10 },
  track: {
    flex: 1,
    width: '70%',
    minWidth: 16,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.surfaceMuted,
  },
  bar: { width: '100%', borderRadius: tokens.radius.sm, backgroundColor: tokens.color.primary },
  day: { color: tokens.color.muted, fontSize: 10, textTransform: 'capitalize' },
});
