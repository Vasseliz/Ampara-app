import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/core/auth/useAuth';
import { decidePatientAccess } from '@/core/auth/guard';
import { tokens } from '@/shared/theme/tokens';

export default function PatientLayout() {
  const { state } = useAuth();
  const access = decidePatientAccess(state);

  if (access === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={tokens.color.primary} />
      </View>
    );
  }

  if (access === 'redirect-login') {
    return <Redirect href="/(public)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: tokens.color.primary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="humor" options={{ title: 'Humor' }} />
      <Tabs.Screen name="habitos" options={{ title: 'Hábitos' }} />
      <Tabs.Screen name="medicamentos" options={{ title: 'Remédios' }} />
      <Tabs.Screen name="cofre" options={{ title: 'Cofre' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="convites" options={{ title: 'Convites' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.color.background },
});
