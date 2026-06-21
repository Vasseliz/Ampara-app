import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/core/auth/useAuth';
import { decideInitialRoute } from '@/core/auth/guard';

export default function PublicLayout() {
  const { state } = useAuth();

  // Paciente já autenticado não deve ficar preso nas telas públicas (login /
  // cadastro). Espelha o guard de `(patient)/_layout`. Para `loading`, `error`
  // e `unauthenticated`, renderiza o Stack normalmente — o login trata seu
  // próprio loading/erro inline, sem substituir o formulário por um spinner.
  if (decideInitialRoute(state) === 'patient') {
    return <Redirect href="/(patient)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
