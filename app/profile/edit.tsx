import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getMe, updateProfile } from "../../services/authService";
import { AlertModal, AlertType } from "../../components/ui/AlertModal";
import { T } from "../../constants/theme";

const C = { primary: T.primary, danger: T.danger, bg: T.bg, card: T.card, text: T.text, muted: T.textSec, border: T.border };

export default function EditProfileScreen() {
    const router = useRouter();

    const [adSoyad, setAdSoyad] = useState("");
    const [eposta, setEposta] = useState("");
    const [mevcutSifre, setMevcutSifre] = useState("");
    const [yeniSifre, setYeniSifre] = useState("");
    const [yeniSifreTekrar, setYeniSifreTekrar] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{
        visible: boolean; type: AlertType; title: string; message?: string; navigateBack?: boolean;
    }>({ visible: false, type: "info", title: "" });

    const showAlert = (type: AlertType, title: string, message?: string, navigateBack = false) =>
        setAlert({ visible: true, type, title, message, navigateBack });

    useEffect(() => {
        getMe().then((profil) => {
            if (profil) {
                setAdSoyad(profil.adSoyad);
                setEposta(profil.eposta);
            }
            setLoading(false);
        });
    }, []);

    const handleKaydet = async () => {
        if (!adSoyad.trim()) return showAlert("warning", "Eksik Bilgi", "Ad soyad alanı boş bırakılamaz.");

        if (yeniSifre) {
            if (yeniSifre.length < 6) return showAlert("warning", "Geçersiz Şifre", "Yeni şifreniz en az 6 karakter olmalıdır.");
            if (yeniSifre !== yeniSifreTekrar) return showAlert("warning", "Şifreler Eşleşmiyor", "Yeni şifre ile tekrarı aynı olmalı.");
            if (!mevcutSifre) return showAlert("warning", "Mevcut Şifre Gerekli", "Şifrenizi değiştirmek için mevcut şifrenizi girin.");
        }

        setSaving(true);
        const sonuc = await updateProfile({
            adSoyad: adSoyad.trim(),
            mevcutSifre: mevcutSifre || undefined,
            yeniSifre: yeniSifre || undefined,
        });
        setSaving(false);

        if (sonuc.ok) {
            const sifreDegisti = !!yeniSifre;
            showAlert(
                "success",
                sifreDegisti ? "Şifreniz Değiştirildi" : "Profil Güncellendi",
                sifreDegisti
                    ? "Şifreniz başarıyla değiştirildi. Bilgileriniz kaydedildi."
                    : "Profil bilgileriniz başarıyla güncellendi.",
                true
            );
        } else {
            const mesaj = sonuc.mesaj ?? "";
            if (mesaj.toLowerCase().includes("şifre") || mesaj.toLowerCase().includes("sifre")) {
                showAlert("error", "Mevcut Şifre Hatalı", "Girdiğiniz mevcut şifre yanlış. Lütfen tekrar deneyin.");
            } else {
                showAlert("error", "Güncelleme Başarısız", mesaj || "Profil güncellenemedi. Tekrar deneyin.");
            }
        }
    };

    const handleAlertClose = () => {
        const navigate = alert.navigateBack;
        setAlert({ ...alert, visible: false });
        if (navigate) {
            setTimeout(() => router.back(), 150);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg }}>
                <ActivityIndicator size="large" color={C.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={C.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profili Düzenle</Text>
                <TouchableOpacity
                    style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                    onPress={handleKaydet}
                    disabled={saving}
                >
                    {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Kaydet</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                {/* Kişisel Bilgiler */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
                    <Text style={styles.label}>Ad Soyad</Text>
                    <TextInput
                        style={styles.input}
                        value={adSoyad}
                        onChangeText={setAdSoyad}
                        placeholder="Ad Soyad"
                        placeholderTextColor={C.muted}
                    />
                    <Text style={[styles.label, { marginTop: 14 }]}>E-posta</Text>
                    <TextInput
                        style={[styles.input, styles.inputDisabled]}
                        value={eposta}
                        editable={false}
                        placeholderTextColor={C.muted}
                    />
                    <Text style={styles.hint}>E-posta adresi değiştirilemez.</Text>
                </View>

                {/* Şifre Değiştir */}
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <Text style={styles.sectionTitle}>Şifre Değiştir</Text>
                    <Text style={styles.hint}>Şifrenizi değiştirmek istemiyorsanız boş bırakın.</Text>

                    <Text style={[styles.label, { marginTop: 12 }]}>Mevcut Şifre</Text>
                    <TextInput
                        style={styles.input}
                        value={mevcutSifre}
                        onChangeText={setMevcutSifre}
                        placeholder="••••••••"
                        placeholderTextColor={C.muted}
                        secureTextEntry
                    />

                    <Text style={[styles.label, { marginTop: 14 }]}>Yeni Şifre</Text>
                    <TextInput
                        style={styles.input}
                        value={yeniSifre}
                        onChangeText={setYeniSifre}
                        placeholder="En az 6 karakter"
                        placeholderTextColor={C.muted}
                        secureTextEntry
                    />

                    <Text style={[styles.label, { marginTop: 14 }]}>Yeni Şifre Tekrar</Text>
                    <TextInput
                        style={[styles.input, yeniSifre && yeniSifreTekrar && yeniSifre !== yeniSifreTekrar && styles.inputError]}
                        value={yeniSifreTekrar}
                        onChangeText={setYeniSifreTekrar}
                        placeholder="Şifrenizi tekrar girin"
                        placeholderTextColor={C.muted}
                        secureTextEntry
                    />
                    {yeniSifre && yeniSifreTekrar && yeniSifre !== yeniSifreTekrar && (
                        <Text style={styles.errorText}>Şifreler eşleşmiyor</Text>
                    )}
                </View>
            </ScrollView>
            <AlertModal
                visible={alert.visible}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                onClose={handleAlertClose}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 17, fontWeight: "700", color: C.text },
    saveBtn: {
        backgroundColor: C.primary, paddingHorizontal: 16,
        paddingVertical: 8, borderRadius: 10, minWidth: 70, alignItems: "center",
    },
    saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    scroll: { flex: 1 },
    section: {
        backgroundColor: C.card, marginHorizontal: 16, marginTop: 16,
        borderRadius: 16, padding: 16,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    },
    sectionTitle: { fontSize: 15, fontWeight: "700", color: C.text, marginBottom: 14 },
    label: { fontSize: 12, fontWeight: "600", color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 },
    input: {
        borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
        padding: 13, fontSize: 14, color: C.text, backgroundColor: C.bg,
    },
    inputDisabled: { backgroundColor: "#F1F5F9", color: C.muted },
    inputError: { borderColor: C.danger },
    hint: { fontSize: 12, color: C.muted, marginTop: 6 },
    errorText: { fontSize: 12, color: C.danger, marginTop: 4 },
});
