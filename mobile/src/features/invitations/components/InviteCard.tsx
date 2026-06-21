import { StyleSheet, Text, View } from 'react-native';
import { AppIcon, Button, Card } from '@/shared/components';
import { testIDs } from '@/shared/testing/testIDs';
import { tokens } from '@/shared/theme/tokens';
import { isInviteExpired, type Invitation } from '../domain/invite';

interface InviteCardProps {
  invitation: Invitation;
  accepting?: boolean;
  onAccept: (id: string) => void;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value));
}

export function InviteCard({ invitation, accepting, onAccept }: InviteCardProps) {
  const expired = isInviteExpired(invitation);

  return (
    <Card testID={testIDs.invitations.item(invitation.id)}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <AppIcon name="person" color={tokens.color.primary} size={22} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>PROFISSIONAL</Text>
          <Text style={styles.name}>{invitation.professionalName}</Text>
          <Text style={styles.email}>{invitation.professionalEmail}</Text>
        </View>
      </View>
      <Text style={[styles.expiration, expired && styles.expired]}>
        {expired ? 'Convite expirado' : `Válido até ${formatDate(invitation.expiresAt)}`}
      </Text>
      {!expired ? (
        <Button
          label="Aceitar convite"
          loading={accepting}
          onPress={() => onAccept(invitation.id)}
          testID={testIDs.invitations.accept(invitation.id)}
          accessibilityLabel={`Aceitar convite de ${invitation.professionalName}`}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', gap: tokens.spacing.md, alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: tokens.radius.md, backgroundColor: tokens.color.primarySoft, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 2 },
  eyebrow: { color: tokens.color.muted, fontSize: 10, letterSpacing: 0.8, fontWeight: tokens.font.weightBold },
  name: { color: tokens.color.textStrong, fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold },
  email: { color: tokens.color.muted, fontSize: tokens.font.md },
  expiration: { color: tokens.color.success, fontSize: tokens.font.sm },
  expired: { color: tokens.color.danger, fontWeight: tokens.font.weightMedium },
});
