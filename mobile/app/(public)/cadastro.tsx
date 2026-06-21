import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon, Button, Card, PasswordField, ScreenContainer, TextField, Toast } from '@/shared/components';
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
        <View style={styles.logo}>
          <AppIcon name="person" color={tokens.color.primary} size={32} />
        </View>
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>Comece seu acompanhamento no Ampara.</Text>
      </View>

      <Card style={styles.form}>
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
        Já tenho uma conta
      </Link>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: tokens.spacing.xs, marginVertical: tokens.spacing.lg },
  logo: { width: 68, height: 68, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.color.primarySoft, marginBottom: tokens.spacing.sm },
  title: { fontSize: tokens.font.xxl, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  subtitle: { fontSize: tokens.font.md, color: tokens.color.muted },
  form: { gap: tokens.spacing.md, padding: tokens.spacing.lg },
  link: { color: tokens.color.primaryDark, fontWeight: tokens.font.weightBold, textAlign: 'center', paddingVertical: tokens.spacing.sm },
});
