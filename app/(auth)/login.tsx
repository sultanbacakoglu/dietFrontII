import { useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { MyInput } from "../../components/ui/MyInput"; // MyInput dosyasını oluşturmuştuk

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Şimdilik direkt geçiş yapıyoruz, ilerde buraya Firebase/API eklersin
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* Buraya tasarımındaki mavi ikon gelecek */}
          <View style={styles.logoPlaceholder}>
            <Text style={{ color: "#007AFF", fontSize: 24 }}>+</Text>
          </View>
          <Text style={styles.title}>Diyetisyen Paneli</Text>
          <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>
        </View>

        <MyInput
          label="E-posta"
          placeholder="e-posta@adresiniz.com"
          value={email}
          onChangeText={setEmail}
        />

        <MyInput
          label="Şifre"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.footerText}>
            Henüz hesabınız yok mu? <Text style={styles.link}>Kayıt Ol</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 25, flex: 1, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A" },
  subtitle: { color: "#666", marginTop: 5 },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footer: { marginTop: 30, alignItems: "center" },
  footerText: { color: "#666" },
  link: { color: "#007AFF", fontWeight: "bold" },
});
