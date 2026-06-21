import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ApiError } from '@/core/api';
import { PageIntro, Toast } from '@/shared/components';
import { testIDs } from '@/shared/testing/testIDs';
import { tokens } from '@/shared/theme/tokens';
import type { Invitation } from '../domain/invite';
import { useAcceptInvite } from '../hooks/useAcceptInvite';
import { useReceivedInvites } from '../hooks/useReceivedInvites';
import { InviteCard } from './InviteCard';

function acceptErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.kind === 'gone') return 'Este convite expirou.';
    if (error.kind === 'not_found') return 'Este convite não está mais disponível.';
    if (error.kind === 'bad_request') return 'Este convite já foi utilizado ou cancelado.';
    if (error.kind === 'network') return 'Sem conexão. O convite não foi aceito.';
  }
  return 'Não foi possível aceitar o convite.';
}

export function InvitationsView() {
  const invitations = useReceivedInvites();
  const accept = useAcceptInvite();

  const renderInvitation = ({ item }: { item: Invitation }) => (
    <InviteCard
      invitation={item}
      accepting={accept.isPending && accept.variables === item.id}
      onAccept={(id) => accept.mutate(id)}
    />
  );

  if (invitations.isLoading && !invitations.data) {
    return (
      <View testID={testIDs.invitations.screen} style={styles.center}>
        <ActivityIndicator color={tokens.color.primary} />
        <Text style={styles.muted}>Carregando convites...</Text>
      </View>
    );
  }

  return (
    <View testID={testIDs.invitations.screen} style={styles.screen}>
      <FlatList
        testID={testIDs.invitations.list}
        data={invitations.data ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderInvitation}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={invitations.isRefetching}
            onRefresh={() => invitations.refetch()}
            tintColor={tokens.color.primary}
            colors={[tokens.color.primary]}
          />
        }
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <PageIntro
              icon="invitations"
              title="Convites"
              subtitle="Profissionais que querem acompanhar seu cuidado aparecem aqui."
            />
            {accept.isError ? (
              <Toast
                testID={testIDs.invitations.error}
                message={acceptErrorMessage(accept.error)}
                variant="error"
              />
            ) : null}
            {accept.isSuccess ? (
              <Toast
                testID={testIDs.invitations.success}
                message={`Convite de ${accept.data.professionalName} aceito.`}
                variant="success"
              />
            ) : null}
            {invitations.isError ? (
              <Toast
                testID={testIDs.invitations.error}
                message="Não foi possível carregar os convites."
                variant="error"
              />
            ) : null}
          </View>
        }
        ListEmptyComponent={!invitations.isError ? (
          <Text testID={testIDs.invitations.empty} style={styles.empty}>
            Você não possui convites pendentes.
          </Text>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: tokens.spacing.sm, backgroundColor: tokens.color.background },
  content: { padding: tokens.spacing.lg, paddingBottom: tokens.spacing.xl },
  header: { gap: tokens.spacing.md, marginBottom: tokens.spacing.md },
  muted: { color: tokens.color.muted, fontSize: tokens.font.md },
  separator: { height: tokens.spacing.md },
  empty: { paddingVertical: tokens.spacing.xl, textAlign: 'center', color: tokens.color.muted, fontSize: tokens.font.md },
});
