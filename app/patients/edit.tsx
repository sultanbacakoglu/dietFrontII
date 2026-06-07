import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { getHastaById, hastaGuncelle } from "../../services/api";
import { AlertModal, AlertType } from "../../components/ui/AlertModal";
import { T } from "../../constants/theme";

const C = { primary: T.primary, danger: T.danger, bg: T.bg, card: T.card, text: T.text, muted: T.textSec, border: T.border };

const CINSIYETLER = ["Kadın", "Erkek", "Belirtmek istemiyor"];

export default function EditPatientScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [adSoyad, setAdSoyad] = useState("");
    const [eposta, setEposta] = useState("");
    const [telefon, setTelefon] = useState("");
    const [dogumTarihi, setDogumTarihi] = useState("");
    const [cinsiyet, setCinsiyet] = useState("");
    const [boy, setBoy] = useState("");
    const [kilo, setKilo] = useState("");
    const [sikayet, setSikayet] = useState("");
    const [notlar, setNotlar] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState<{
        visible: boolean; type: AlertType; title: string; message?: string; navigateBack?: boolean;
    }>({ visible: false, type: "info", title: "" });

    const showAlert = (type: AlertType, title: string, message?: string, navigateBack = false) =>
        setAlert({ visible: true, type, title, message, navigateBack });

    useEffect(() => {
        if (!id) return;
        getHastaById(Number(id)).then((h) => {
            if (h) {
                setAdSoyad(h.adSoyad);
                setEposta(h.eposta);
                setTelefon(h.telefon ?? "");
                setDogumTarihi(h.dogumTarihi ?? "");
                setCinsiyet(h.cinsiyet ?? "");
                setBoy(h.boy ? String(h.boy) : "");
                setKilo(h.kilo ? String(h.kilo) : "");
                setSikayet(h.sikayet ?? "");
                setNotlar(h.notlar ?? "");
            }
            setLoading(false);
        });
    }, [id]);

    const handleKaydet = async () => {
        if (!adSoyad.trim()) return showAlert("warning", "Eksik Bilgi", "Ad soyad alanı boş bırakılamaz.");
        if (!eposta.trim() || !/\S+@\S+\.\S+/.test(eposta)) {
            return showAlert("warning", "Geçersiz E-posta", "Lütfen geçerli bir e-posta adresi girin.");
        }

        setSaving(true);
        const sonuc = await hastaGuncelle(Number(id), {
            adSoyad: adSoyad.trim(),
            eposta: eposta.trim(),
            telefon: telefon.trim() || undefined,
            dogumTarihi: dogumTarihi.trim() || undefined,
            cinsiyet: cinsiyet || undefined,
            boy: boy ? parseFloat(boy) : undefined,
            kilo: kilo ? parseFloat(kilo) : undefined,
            sikayet: sikayet.trim() || undefined,
            notlar: notlar.trim() || undefined,
        });
        setSaving(false);

        if (sonuc) {
            showAlert("success", "Hasta Güncellendi", "Hasta bilgileri başarıyla kaydedildi.", true);
        } else {
            showAlert("error", "Güncelleme Başarısız", "Hasta bilgileri kaydedilemedi. Tekrar deneyin.");
        }
    };

    const handleAlertClose = () => {
        const navigate = alert.navigateBack;
        setAlert({ ...alert, visible: false });
        if (navigate) setTimeout(() => router.back(), 150);
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
                <Text style={styles.headerTitle}>Hasta Düzenle</Text>
                <TouchableOpacity
                    style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                    onPress={handleKaydet}
                    disabled={saving}
                >
                    {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Kaydet</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

                    <Text style={styles.label}>Ad Soyad *</Text>
                    <TextInput style={styles.input} value={adSoyad} onChangeText={setAdSoyad} placeholder="Ad Soyad" placeholderTextColor={C.muted} />

                    <Text style={[styles.label, { marginTop: 14 }]}>E-posta *</Text>
                    <TextInput style={styles.input} value={eposta} onChangeText={setEposta} placeholder="ornek@email.com" placeholderTextColor={C.muted} keyboardType="email-address" autoCapitalize="none" />

                    <Text style={[styles.label, { marginTop: 14 }]}>Telefon</Text>
                    <TextInput style={styles.input} value={telefon} onChangeText={setTelefon} placeholder="0555 123 45 67" placeholderTextColor={C.muted} keyboardType="phone-pad" />

                    <Text style={[styles.label, { marginTop: 14 }]}>Doğum Tarihi</Text>
                    <TextInput style={styles.input} value={dogumTarihi} onChangeText={setDogumTarihi} placeholder="YYYY-MM-DD" placeholderTextColor={C.muted} />

                    <Text style={[styles.label, { marginTop: 14 }]}>Cinsiyet</Text>
                    <View style={styles.chipRow}>
                        {CINSIYETLER.map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[styles.chip, cinsiyet === c && styles.chipSelected]}
                                onPress={() => setCinsiyet(cinsiyet === c ? "" : c)}
                            >
                                <Text style={[styles.chipText, cinsiyet === c && styles.chipTextSelected]}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fiziksel Bilgiler</Text>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Boy (cm)</Text>
                            <TextInput style={styles.input} value={boy} onChangeText={setBoy} placeholder="170" placeholderTextColor={C.muted} keyboardType="numeric" />
                        </View>
                        <View style={{ width: 12 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Kilo (kg)</Text>
                            <TextInput style={styles.input} value={kilo} onChangeText={setKilo} placeholder="70" placeholderTextColor={C.muted} keyboardType="numeric" />
                        </View>
                    </View>
                </View>

                <View style={[styles.section, { marginBottom: 40 }]}>
                    <Text style={styles.sectionTitle}>Tıbbi Bilgiler</Text>

                    <Text style={styles.label}>Şikayet / Hedef</Text>
                    <TextInput
                        style={[styles.input, styles.multiline]}
                        value={sikayet}
                        onChangeText={setSikayet}
                        placeholder="Hastanın şikayeti veya hedefi..."
                        placeholderTextColor={C.muted}
                        multiline
                        textAlignVertical="top"
                    />

                    <Text style={[styles.label, { marginTop: 14 }]}>Notlar</Text>
                    <TextInput
                        style={[styles.input, styles.multiline]}
                        value={notlar}
                        onChangeText={setNotlar}
                        placeholder="Ek notlar..."
                        placeholderTextColor={C.muted}
                        multiline
                        textAlignVertical="top"
                    />
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
    multiline: { minHeight: 70, textAlignVertical: "top" },
    row: { flexDirection: "row" },
    chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    chip: {
        paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10,
        borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg,
    },
    chipSelected: { backgroundColor: T.primaryLight, borderColor: C.primary },
    chipText: { fontSize: 13, fontWeight: "600", color: C.muted },
    chipTextSelected: { color: C.primary },
});
