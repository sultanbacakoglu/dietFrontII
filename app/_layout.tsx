import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="appointments/create" />
      <Stack.Screen name="appointments/edit" />
      <Stack.Screen name="diet/create" />
      <Stack.Screen name="diet/[id]" />
      <Stack.Screen name="profile/edit" />
    </Stack>
  );
}
