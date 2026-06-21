import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Conversas' }} />
      <Stack.Screen name="[professionalId]" options={{ title: 'Conversa' }} />
    </Stack>
  );
}
