import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon, Button, Card, PasswordField, ScreenContainer, TextField, Toast } from '@/shared/components';
import { testIDs } from '@/shared/testing/testIDs';
import { tokens } from '@/shared/theme/tokens';
import { useAuth } from '@/core/auth/useAuth';

export default function Login() {
  const { state, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loading = state.status === 'loading';
  const error = state.status === 'error' ? state.error : null;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.logo}>
          <AppIcon name="habits" color={tokens.color.primary} size={34} />
        </View>
        <Text style={styles.title}>Ampara</Text>
        <Text style={styles.subtitle}>Cuidado diário, simples e próximo.</Text>
      </View>

      <Card style={styles.form}>
        <Text style={styles.formTitle}>Entre na sua conta</Text>
        <Toast message={error} variant="error" testID={testIDs.auth.login.error} />
        <TextField label="E-mail" value={email} onChangeText={setEmail} placeholder="voce@email.com" keyboardType="email-address" autoCapitalize="none" testID={testIDs.auth.login.email} accessibilityLabel="E-mail" />
        <PasswordField label="Senha" value={password} onChangeText={setPassword} testID={testIDs.auth.login.password} accessibilityLabel="Senha" />
        <Button label="Entrar" onPress={() => login(email.trim(), password)} loading={loading} testID={testIDs.auth.login.submit} accessibilityLabel="Entrar" />
        <Link href="/(public)/cadastro" style={styles.link}>Criar uma conta</Link>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: tokens.spacing.xs, marginVertical: tokens.spacing.xl },
  logo: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.color.primarySoft, marginBottom: tokens.spacing.sm },
  title: { fontSize: tokens.font.xxl, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  subtitle: { fontSize: tokens.font.md, color: tokens.color.muted },
  form: { gap: tokens.spacing.md, padding: tokens.spacing.lg },
  formTitle: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  link: { color: tokens.color.primaryDark, fontWeight: tokens.font.weightBold, textAlign: 'center', paddingVertical: tokens.spacing.sm },
});
