import { MyInput } from "../../components/ui/MyInput";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Theme } from "../../constants/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const { T } = useTheme();
  const styles = useMemo(() => createStyles(T), [T]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Yeni Hesap Oluştur</Text>
      <MyInput label="Ad Soyad" value={name} onChangeText={setName} placeholder="Adınız Soyadınız" />
      <MyInput label="E-posta" value={email} onChangeText={setEmail} placeholder="e-posta@adresiniz.com" />
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (T: Theme) => StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: "center", backgroundColor: T.bg },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center", color: T.text },
  button: { backgroundColor: T.primary, padding: 18, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
