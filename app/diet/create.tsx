import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getHastalar, Hasta } from "../../services/api";
import { diyetPlaniOlustur } from "../../services/dietService";
import { useTheme } from "../../contexts/ThemeContext";
import { Theme } from "../../constants/theme";


function formatDate(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(base: string, days: number) {
    const d = new Date(base + "T00:00:00");
    d.setDate(d.getDate() + days);
    return formatDate(d);
}

const DURUMLAR = [
    { label: "Aktif", value: "aktif" },
    { label: "Taslak", value: "taslak" },
];

export default function CreateDietPlanScreen() {
    const { T } = useTheme();
    const C = T;
    const styles = useMemo(() => createStyles(T), [T]);
    const router = useRouter();
    const { hastaId: paramHastaId } = useLocalSearchParams<{ hastaId?: string }>();

    const [hastalar, setHastalar] = useState<Hasta[]>([]);
    const [hastaArama, setHastaArama] = useState("");
    const [hastaDropdown, setHastaDropdown] = useState(false);
    const [secilenHasta, setSecilenHasta] = useState<Hasta | null>(null);
    const [hastaLoading, setHastaLoading] = useState(true);

    const bugun = formatDate(new Date());
    const [baslik, setBaslik] = useState("");
    const [aciklama, setAciklama] = useState("");
    const [baslangic, setBaslangic] = useState(bugun);
    const [bitis, setBitis] = useState(addDays(bugun, 30));
    const [kalori, setKalori] = useState("");
    const [kahvalti, setKahvalti] = useState("");
    const [ogle, setOgle] = useState("");
    const [aksam, setAksam] = useState("");
    const [araOgun, setAraOgun] = useState("");
    const [notlar, setNotlar] = useState("");
    const [durum, setDurum] = useState<"aktif" | "taslak">("aktif");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getHastalar().then((data) => {
            setHastalar(data);
            if (paramHastaId) {
                const h = data.find((x) => x.id === Number(paramHastaId));
                if (h) setSecilenHasta(h);
            }
            setHastaLoading(false);
        });
    }, []);

    const filtreliHastalar = hastalar.filter((h) =>
        h.adSoyad.toLowerCase().includes(hastaArama.toLowerCase())
    );

    const handleKaydet = async () => {
        if (!baslik.trim()) return Alert.alert("Uyarı", "Plan başlığı gerekli");
        if (!secilenHasta) return Alert.alert("Uyarı", "Hasta seçiniz");

        setSaving(true);
        const sonuc = await diyetPlaniOlustur({
            baslik: baslik.trim(),
            aciklama: aciklama.trim() || undefined,
            baslangicTarihi: baslangic,
            bitisTarihi: bitis,
            kaloriHedefi: kalori ? parseInt(kalori) : undefined,
            kahvalti: kahvalti.trim() || undefined,
            ogleYemegi: ogle.trim() || undefined,
            aksamYemegi: aksam.trim() || undefined,
            araOgun: araOgun.trim() || undefined,
            notlar: notlar.trim() || undefined,
            durum,
            hastaId: secilenHasta.id!,
        });
        setSaving(false);

        if (sonuc) {
            router.dismissAll();
            router.replace({ pathname: "/(tabs)/diet", params: { refresh: "1" } });
        } else {
            Alert.alert("Hata", "Plan oluşturulamadı. Tekrar deneyin.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={C.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Yeni Diyet Planı</Text>
                <TouchableOpacity
                    style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                    onPress={handleKaydet}
                    disabled={saving}
                >
                    {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Kaydet</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                {/* Hasta */}
                <View style={styles.section}>
                    <Text style={styles.label}>Hasta *</Text>
                    <TouchableOpacity
                        style={styles.selectBox}
                        onPress={() => { setHastaDropdown(!hastaDropdown); setHastaArama(""); }}
                    >
                        {hastaLoading ? <ActivityIndicator size="small" color={C.primary} /> : (
                            <>
                                <Ionicons name="person-outline" size={18} color={T.textSec} />
                                <Text style={[styles.selectText, secilenHasta && { color: C.text }]}>
                                    {secilenHasta ? secilenHasta.adSoyad : "Hasta seçin..."}
                                </Text>
                                <Ionicons name={hastaDropdown ? "chevron-up" : "chevron-down"} size={18} color={T.textSec} />
                            </>
                        )}
                    </TouchableOpacity>
                    {hastaDropdown && (
                        <View style={styles.dropdown}>
                            <View style={styles.searchRow}>
                                <Ionicons name="search-outline" size={16} color={T.textSec} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Hasta ara..."
                                    value={hastaArama}
                                    onChangeText={setHastaArama}
                                    autoFocus
                                />
                            </View>
                            <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                                {filtreliHastalar.map((h) => (
                                    <TouchableOpacity
                                        key={h.id}
                                        style={styles.dropdownItem}
                                        onPress={() => { setSecilenHasta(h); setHastaDropdown(false); }}
                                    >
                                        <View style={styles.dropdownAvatar}>
                                            <Text style={styles.dropdownAvatarText}>{h.adSoyad.charAt(0)}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.dropdownName}>{h.adSoyad}</Text>
                                            <Text style={styles.dropdownSub}>{h.eposta}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Temel Bilgiler */}
                <View style={styles.section}>
                    <Text style={styles.label}>Plan Başlığı *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Örn: 1 Aylık Kilo Verme Programı"
                        placeholderTextColor={T.textSec}
                        value={baslik}
                        onChangeText={setBaslik}
                    />
                    <Text style={[styles.label, { marginTop: 14 }]}>Açıklama</Text>
                    <TextInput
                        style={[styles.input, styles.multiline]}
                        placeholder="Plan hakkında kısa açıklama..."
                        placeholderTextColor={T.textSec}
                        multiline
                        value={aciklama}
                        onChangeText={setAciklama}
                        textAlignVertical="top"
                    />
                </View>

                {/* Tarih & Kalori */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Başlangıç</Text>
                            <TextInput
                                style={styles.input}
                                value={baslangic}
                                onChangeText={setBaslangic}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={T.textSec}
                            />
                        </View>
                        <View style={{ width: 12 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Bitiş</Text>
                            <TextInput
                                style={styles.input}
                                value={bitis}
                                onChangeText={setBitis}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={T.textSec}
                            />
                        </View>
                    </View>
                    <Text style={[styles.label, { marginTop: 14 }]}>Günlük Kalori Hedefi (kcal)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Örn: 1800"
                        placeholderTextColor={T.textSec}
                        keyboardType="numeric"
                        value={kalori}
                        onChangeText={setKalori}
                    />
                </View>

                {/* Öğünler */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Öğün Detayları</Text>
                    {[
                        { label: "☀️  Kahvaltı", value: kahvalti, set: setKahvalti, ph: "Yumurta, tam tahıllı ekmek, sebze..." },
                        { label: "🥗  Öğle Yemeği", value: ogle, set: setOgle, ph: "Izgara tavuk, salata, bulgur..." },
                        { label: "🌙  Akşam Yemeği", value: aksam, set: setAksam, ph: "Balık, buharda sebze, çorba..." },
                        { label: "🍎  Ara Öğün", value: araOgun, set: setAraOgun, ph: "Meyve, yoğurt, kuruyemiş..." },
                    ].map(({ label, value, set, ph }) => (
                        <View key={label} style={{ marginBottom: 14 }}>
                            <Text style={styles.label}>{label}</Text>
                            <TextInput
                                style={[styles.input, styles.multiline]}
                                placeholder={ph}
                                placeholderTextColor={T.textSec}
                                multiline
                                value={value}
                                onChangeText={set}
                                textAlignVertical="top"
                            />
                        </View>
                    ))}
                </View>

                {/* Durum */}
                <View style={styles.section}>
                    <Text style={styles.label}>Durum</Text>
                    <View style={styles.chipRow}>
                        {DURUMLAR.map((d) => (
                            <TouchableOpacity
                                key={d.value}
                                style={[styles.chip, durum === d.value && styles.chipSelected]}
                                onPress={() => setDurum(d.value as any)}
                            >
                                <Text style={[styles.chipText, durum === d.value && styles.chipTextSelected]}>
                                    {d.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Notlar */}
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <Text style={styles.label}>Ek Notlar</Text>
                    <TextInput
                        style={[styles.input, styles.multiline, { minHeight: 80 }]}
                        placeholder="Diyet sırasında dikkat edilmesi gerekenler..."
                        placeholderTextColor={T.textSec}
                        multiline
                        value={notlar}
                        onChangeText={setNotlar}
                        textAlignVertical="top"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (T: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: T.bg },
    header: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: T.card, borderBottomWidth: 1, borderBottomColor: T.border,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 17, fontWeight: "700", color: T.text },
    saveBtn: {
        backgroundColor: T.primary, paddingHorizontal: 16,
        paddingVertical: 8, borderRadius: 10, minWidth: 70, alignItems: "center",
    },
    saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    scroll: { flex: 1 },
    section: {
        backgroundColor: T.card, marginHorizontal: 16, marginTop: 14,
        borderRadius: 16, padding: 16,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    },
    sectionTitle: { fontSize: 15, fontWeight: "700", color: T.text, marginBottom: 14 },
    label: { fontSize: 12, fontWeight: "600", color: T.textSec, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 },
    input: {
        borderWidth: 1.5, borderColor: T.border, borderRadius: 12,
        padding: 13, fontSize: 14, color: T.text, backgroundColor: T.bg,
    },
    multiline: { minHeight: 70, textAlignVertical: "top" },
    row: { flexDirection: "row" },
    selectBox: {
        flexDirection: "row", alignItems: "center", gap: 10,
        borderWidth: 1.5, borderColor: T.border, borderRadius: 12,
        padding: 13, backgroundColor: T.bg,
    },
    selectText: { flex: 1, fontSize: 15, color: T.textSec },
    dropdown: {
        marginTop: 8, borderWidth: 1.5, borderColor: T.border,
        borderRadius: 12, overflow: "hidden", backgroundColor: T.card,
    },
    searchRow: {
        flexDirection: "row", alignItems: "center", gap: 8, padding: 12,
        borderBottomWidth: 1, borderBottomColor: T.border,
    },
    searchInput: { flex: 1, fontSize: 14, color: T.text },
    dropdownItem: {
        flexDirection: "row", alignItems: "center", gap: 12,
        padding: 12, borderBottomWidth: 1, borderBottomColor: T.bg,
    },
    dropdownAvatar: {
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: T.primaryLight, justifyContent: "center", alignItems: "center",
    },
    dropdownAvatarText: { fontWeight: "700", color: T.primary, fontSize: 14 },
    dropdownName: { fontSize: 14, fontWeight: "600", color: T.text },
    dropdownSub: { fontSize: 12, color: T.textSec },
    chipRow: { flexDirection: "row", gap: 8 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
        borderWidth: 1.5, borderColor: T.border, backgroundColor: T.bg,
    },
    chipSelected: { backgroundColor: T.primaryLight, borderColor: T.primary },
    chipText: { fontSize: 13, fontWeight: "600", color: T.textSec },
    chipTextSelected: { color: T.primary },
});
