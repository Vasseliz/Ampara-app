import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button, PasswordField, ScreenContainer, TextField, Toast } from '@/shared/components';
import { testIDs } from '@/shared/testing/testIDs';
import { tokens } from '@/shared/theme/tokens';
import { useAuth } from '@/core/auth/useAuth';

export default function Cadastro() {
  const { state, register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loading = state.status === 'loading';
  const error = state.status === 'error' ? state.error : null;

  const canSubmit =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    password !== '';

  function handleSubmit() {
    if (!canSubmit) return;
    register({ firstName, lastName, email, password });
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Cadastre-se como paciente</Text>
      </View>

      <Toast message={error} variant="error" />

      <TextField
        label="Nome"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Ana"
        autoCapitalize="words"
        testID={testIDs.auth.register.firstName}
        accessibilityLabel="Nome"
      />
      <TextField
        label="Sobrenome"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Silva"
        autoCapitalize="words"
        testID={testIDs.auth.register.lastName}
        accessibilityLabel="Sobrenome"
      />
      <TextField
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        testID={testIDs.auth.register.email}
        accessibilityLabel="E-mail"
      />
      <PasswordField
        label="Senha"
        value={password}
        onChangeText={setPassword}
        testID={testIDs.auth.register.password}
        accessibilityLabel="Senha"
      />

      <Button
        label="Cadastrar"
        onPress={handleSubmit}
        loading={loading}
        disabled={!canSubmit}
        testID={testIDs.auth.register.submit}
        accessibilityLabel="Cadastrar"
      />

      <Link href="/(public)/login" style={styles.link}>
        Já tenho conta
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
