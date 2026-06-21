import { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ApiError } from '@/core/api';
import { PageIntro, Toast } from '@/shared/components';
import { testIDs } from '@/shared/testing/testIDs';
import { tokens } from '@/shared/theme/tokens';
import type { Medication } from '../domain/medication.types';
import { useAdherence } from '../hooks/useAdherence';
import { useTakeMedication } from '../hooks/useTakeMedication';
import { useTodayMedications } from '../hooks/useTodayMedications';
import { AdherenceChart } from './AdherenceChart';
import { MedicationItem } from './MedicationItem';

function takeErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.kind === 'network') {
    return 'Sem conexão. A tomada não foi registrada.';
  }
  return 'Não foi possível registrar a tomada. Tente novamente.';
}

export function MedicationsView() {
  const medications = useTodayMedications();
  const adherence = useAdherence();
  const take = useTakeMedication();

  const refresh = useCallback(async () => {
    await Promise.all([medications.refetch(), adherence.refetch()]);
  }, [adherence, medications]);

  const renderMedication = ({ item }: { item: Medication }) => (
    <MedicationItem
      medication={item}
      taking={take.isPending && take.variables === item.id}
      onTake={(id) => take.mutate(id)}
    />
  );

  const loading = medications.isLoading && !medications.data;
  const refreshing = medications.isRefetching || adherence.isRefetching;

  return (
    <View testID={testIDs.medications.screen} style={styles.screen}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={tokens.color.primary} />
          <Text style={styles.muted}>Carregando medicamentos...</Text>
        </View>
      ) : (
        <FlatList
          testID={testIDs.medications.list}
          data={medications.data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderMedication}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={tokens.color.primary}
              colors={[tokens.color.primary]}
            />
          }
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View style={styles.header}>
              <PageIntro
                icon="medications"
                title="Medicamentos"
                subtitle="Acompanhe suas tomadas e a adesão dos últimos dias."
              />
              <Text style={styles.sectionTitle}>Hoje</Text>
              <AdherenceChart
                adherence={adherence.data}
                loading={adherence.isLoading}
                error={adherence.isError}
              />
              {take.isError ? (
                <Toast
                  testID={testIDs.medications.error}
                  message={takeErrorMessage(take.error)}
                  variant="error"
                />
              ) : null}
              {medications.isError ? (
                <Toast
                  testID={testIDs.medications.error}
                  message="Não foi possível carregar os medicamentos."
                  variant="error"
                />
              ) : null}
            </View>
          }
          ListEmptyComponent={!medications.isError ? (
            <Text testID={testIDs.medications.empty} style={styles.empty}>
              Nenhum medicamento ativo para hoje.
            </Text>
          ) : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.background },
  content: { padding: tokens.spacing.lg, paddingBottom: tokens.spacing.xl },
  header: { gap: tokens.spacing.md, marginBottom: tokens.spacing.md },
  sectionTitle: { color: tokens.color.textStrong, fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold },
  separator: { height: tokens.spacing.md },
  empty: { paddingVertical: tokens.spacing.xl, textAlign: 'center', color: tokens.color.muted, fontSize: tokens.font.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: tokens.spacing.sm },
  muted: { color: tokens.color.muted, fontSize: tokens.font.md },
});
