import { Stack } from 'expo-router';

export default function InvitationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Convites' }} />
    </Stack>
  );
}
