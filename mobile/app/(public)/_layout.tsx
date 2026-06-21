import { Redirect, Stack, useSegments } from 'expo-router';
import { useAuth } from '@/core/auth/useAuth';
import { decideInitialRoute, isInvitationAcceptRoute } from '@/core/auth/guard';

export default function PublicLayout() {
  const { state } = useAuth();
  const segments = useSegments();
  const isInvitationRoute = isInvitationAcceptRoute(segments);

  // Paciente já autenticado não deve ficar preso nas telas públicas (login /
  // cadastro). Espelha o guard de `(patient)/_layout`. Para `loading`, `error`
  // e `unauthenticated`, renderiza o Stack normalmente — o login trata seu
  // próprio loading/erro inline, sem substituir o formulário por um spinner.
  if (decideInitialRoute(state) === 'patient' && !isInvitationRoute) {
    return <Redirect href="/(patient)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
