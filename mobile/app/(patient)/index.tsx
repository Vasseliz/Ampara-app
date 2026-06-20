import { StyleSheet, Text } from 'react-native';
import { Button, Card, ScreenContainer } from '@/shared/components';
import { useAuth } from '@/core/auth/useAuth';
import { tokens } from '@/shared/theme/tokens';

export default function PatientHome() {
  const { state, logout } = useAuth();
  const userId = state.status === 'authenticated' ? state.user.id : '';

  return (
    <ScreenContainer>
      <Text style={styles.title}>Olá 👋</Text>
      <Card>
        <Text style={styles.cardTitle}>Sua sessão está ativa</Text>
        <Text style={styles.muted}>ID: {userId}</Text>
      </Card>
      <Text style={styles.muted}>
        Use as abas para acessar Humor, Hábitos, Remédios, Cofre, Chat e Convites.
      </Text>
      <Button label="Sair" variant="ghost" onPress={logout} accessibilityLabel="Sair" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: tokens.font.xl, fontWeight: tokens.font.weightBold, color: tokens.color.text },
  cardTitle: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightMedium, color: tokens.color.text },
  muted: { fontSize: tokens.font.md, color: tokens.color.muted },
});
