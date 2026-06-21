import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button, PasswordField, ScreenContainer, TextField, Toast } from '@/shared/components';
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
        <Text style={styles.title}>Ampara</Text>
        <Text style={styles.subtitle}>Entre na sua conta de paciente</Text>
      </View>

      <Toast message={error} variant="error" testID={testIDs.auth.login.error} />

      <TextField
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        testID={testIDs.auth.login.email}
        accessibilityLabel="E-mail"
      />
      <PasswordField
        label="Senha"
        value={password}
        onChangeText={setPassword}
        testID={testIDs.auth.login.password}
        accessibilityLabel="Senha"
      />

      <Button
        label="Entrar"
        onPress={() => login(email.trim(), password)}
        loading={loading}
        testID={testIDs.auth.login.submit}
        accessibilityLabel="Entrar"
      />

      <Link href="/(public)/cadastro" style={styles.link}>
        Criar conta
      </Link>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: tokens.spacing.xs, marginBottom: tokens.spacing.md },
  title: { fontSize: tokens.font.xl, fontWeight: tokens.font.weightBold, color: tokens.color.text },
  subtitle: { fontSize: tokens.font.md, color: tokens.color.muted },
  link: { color: tokens.color.primary, fontWeight: tokens.font.weightMedium, textAlign: 'center' },
});
