import { Redirect } from "expo-router";

export default function RootIndex() {
  // Uygulama açıldığı an otomatik olarak Login'e fırlatır
  return <Redirect href="/(auth)/login" />;
}
