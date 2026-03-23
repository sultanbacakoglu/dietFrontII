import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* İndeks dosyamız artık yukarıdaki Redirect olduğu için 
          burada (auth)/login'in tanımlı olduğundan emin oluyoruz */}
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
