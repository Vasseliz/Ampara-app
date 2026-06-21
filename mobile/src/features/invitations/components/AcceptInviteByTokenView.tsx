import { useState } from 'react';
import { ApiError } from '@/core/api';
import { AppIcon, Button, Card, ScreenContainer, Toast } from '@/shared/components';
import { testIDs } from '@/shared/testing/testIDs';
import { tokens } from '@/shared/theme/tokens';
import { StyleSheet, Text, View } from 'react-native';
import { normalizeInviteToken } from '../domain/invite';
import { useAcceptInviteByToken } from '../hooks/useAcceptInviteByToken';

interface AcceptInviteByTokenViewProps {
  token: string | string[] | undefined;
}

function tokenErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.kind === 'gone') return 'Este convite expirou.';
    if (error.kind === 'not_found') return 'O link do convite é inválido.';
    if (error.kind === 'bad_request') return 'Este convite já foi utilizado ou cancelado.';
    if (error.kind === 'network') return 'Sem conexão. Tente novamente quando estiver online.';
  }
  return 'Não foi possível aceitar este convite.';
}

export function AcceptInviteByTokenView({ token }: AcceptInviteByTokenViewProps) {
  const normalizedToken = normalizeInviteToken(token);
  const accept = useAcceptInviteByToken();
  const [submitted, setSubmitted] = useState(false);

  const acceptToken = () => {
    if (!normalizedToken || accept.isPending) return;
    setSubmitted(true);
    accept.mutate(normalizedToken);
  };

  return (
    <ScreenContainer testID={testIDs.invitations.tokenScreen}>
      <Card>
        <View style={styles.icon}><AppIcon name="invitations" color={tokens.color.primary} size={30} /></View>
        <Text style={styles.title}>Aceitar convite</Text>
        <Text style={styles.description}>
          Confirme para criar o vínculo com o profissional que enviou este convite.
        </Text>

        {!normalizedToken ? (
          <Toast
            testID={testIDs.invitations.tokenError}
            message="O link do convite é inválido."
            variant="error"
          />
        ) : null}

        {submitted && accept.isError ? (
          <Toast
            testID={testIDs.invitations.tokenError}
            message={tokenErrorMessage(accept.error)}
            variant="error"
          />
        ) : null}

        {accept.isSuccess ? (
          <Toast
            testID={testIDs.invitations.tokenSuccess}
            message={`Convite de ${accept.data.professionalName} aceito com sucesso.`}
            variant="success"
          />
        ) : (
          <Button
            label="Aceitar convite"
            disabled={!normalizedToken}
            loading={accept.isPending}
            onPress={acceptToken}
            testID={testIDs.invitations.acceptToken}
            accessibilityLabel="Aceitar convite pelo link"
          />
        )}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  icon: { width: 64, height: 64, borderRadius: 22, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.color.primarySoft },
  title: { color: tokens.color.textStrong, textAlign: 'center', fontSize: tokens.font.xl, fontWeight: tokens.font.weightBold },
  description: { color: tokens.color.muted, textAlign: 'center', fontSize: tokens.font.md, lineHeight: 22 },
});
