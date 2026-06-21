import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, StyleSheet, View, type ColorValue } from 'react-native';
import { useAuth } from '@/core/auth/useAuth';
import { decidePatientAccess } from '@/core/auth/guard';
import { AppIcon, type AppIconName } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';

function tabIcon(name: AppIconName) {
  return ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <AppIcon name={name} color={color} size={focused ? 25 : 23} />
  );
}

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
        tabBarInactiveTintColor: tokens.color.muted,
        headerStyle: { backgroundColor: tokens.color.background },
        headerShadowVisible: false,
        headerTitleStyle: {
          color: tokens.color.textStrong,
          fontSize: tokens.font.lg,
          fontWeight: tokens.font.weightBold,
        },
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: tokens.color.border,
          backgroundColor: tokens.color.surface,
          ...tokens.shadow.floating,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: tokens.font.weightMedium },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="medicamentos" options={{ title: 'Meds', tabBarIcon: tabIcon('medications') }} />
      <Tabs.Screen name="humor" options={{ title: 'Humor', tabBarIcon: tabIcon('mood') }} />
      <Tabs.Screen name="habitos" options={{ title: 'Hábitos', tabBarIcon: tabIcon('habits') }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: tabIcon('chat') }} />
      <Tabs.Screen name="cofre" options={{ href: null }} />
      <Tabs.Screen name="convites" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.color.background },
});
