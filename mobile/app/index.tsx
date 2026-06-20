import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/core/auth/useAuth';
import { decideInitialRoute } from '@/core/auth/guard';
import { tokens } from '@/shared/theme/tokens';

export default function Index() {
  const { state } = useAuth();
  const route = decideInitialRoute(state);

  if (route === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={tokens.color.primary} />
      </View>
    );
  }

  return <Redirect href={route === 'patient' ? '/(patient)' : '/(public)/login'} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.color.background },
});
