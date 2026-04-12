import { useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { MyInput } from "../../components/ui/MyInput";
import { login } from "../services/authService";

export default function LoginScreen() {
    const router = useRouter();
    const [eposta, setEposta] = useState("");
    const [sifre, setSifre] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ eposta?: string; sifre?: string }>({});

    const validate = () => {
        const newErrors: { eposta?: string; sifre?: string } = {};
        if (!eposta.trim()) {
            newErrors.eposta = "E-posta gerekli";
        } else if (!/\S+@\S+\.\S+/.test(eposta)) {
            newErrors.eposta = "Geçerli bir e-posta girin";
        }
        if (!sifre) {
            newErrors.sifre = "Şifre gerekli";
        } else if (sifre.length < 6) {
            newErrors.sifre = "Şifre en az 6 karakter olmalı";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const result = await login(eposta, sifre);
            if (result) {
                router.replace("/(tabs)");
            }
        } catch (error: any) {
            Alert.alert("Hata", error.message || "Giriş yapılamadı");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.logoPlaceholder}>
                            <Text style={{ color: "#007AFF", fontSize: 24 }}>+</Text>
                        </View>
                        <Text style={styles.title}>Diyetisyen Paneli</Text>
                        <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>
                    </View>

                    <MyInput
                        label="E-posta"
                        placeholder="e-posta@adresiniz.com"
                        value={eposta}
                        onChangeText={(v: string) => {
                            setEposta(v);
                            if (errors.eposta) setErrors({ ...errors, eposta: undefined });
                        }}
                        error={errors.eposta}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <MyInput
                        label="Şifre"
                        placeholder="••••••••"
                        value={sifre}
                        onChangeText={(v: string) => {
                            setSifre(v);
                            if (errors.sifre) setErrors({ ...errors, sifre: undefined });
                        }}
                        error={errors.sifre}
                        secureTextEntry={true}
                    />

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Giriş Yap</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.footer}
                        onPress={() => router.push("/(auth)/register")}
                    >
                        <Text style={styles.footerText}>
                            Henüz hesabınız yok mu?{" "}
                            <Text style={styles.link}>Kayıt Ol</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    keyboardView: { flex: 1 },
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
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    footer: { marginTop: 30, alignItems: "center" },
    footerText: { color: "#666" },
    link: { color: "#007AFF", fontWeight: "bold" },
});
