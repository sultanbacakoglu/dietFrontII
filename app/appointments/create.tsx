import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getHastalar, Hasta } from "../../services/api";
import { randevuOlustur, RandevuTipi } from "../../services/appointmentService";
import { useTheme } from "../../contexts/ThemeContext";
import { Theme } from "../../constants/theme";

const RANDEVU_TIPLERI: RandevuTipi[] = [
    "İlk Görüşme",
    "Kontrol",
    "Tetkik Sonucu",
    "Diyet Planı",
    "Diğer",
];

const SAATLER = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30",
];

function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function displayDate(dateStr: string): string {
    const [y, m, d] = dateStr.split("-");
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

function getNext7Days(): string[] {
    const days: string[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push(formatDate(d));
    }
    return days;
}

const DAY_NAMES = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

export default function CreateAppointmentScreen() {
    const router = useRouter();
    const { T } = useTheme();
    const COLORS = T;
    const styles = useMemo(() => createStyles(T), [T]);

    const [hastalar, setHastalar] = useState<Hasta[]>([]);
    const [hastaLoading, setHastaLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [secilenHasta, setSecilenHasta] = useState<Hasta | null>(null);
    const [hastaArama, setHastaArama] = useState("");
    const [hastaDropdown, setHastaDropdown] = useState(false);

    const [secilenTarih, setSecilenTarih] = useState(formatDate(new Date()));
    const [secilenSaat, setSecilenSaat] = useState("");
    const [secilenTip, setSecilenTip] = useState<RandevuTipi | "">("");
    const [notlar, setNotlar] = useState("");

    const days = getNext7Days();

    useEffect(() => {
        getHastalar().then((data) => {
            setHastalar(data);
            setHastaLoading(false);
        });
    }, []);

    const filtreliHastalar = hastalar.filter((h) =>
        h.adSoyad.toLowerCase().includes(hastaArama.toLowerCase())
    );

    const handleKaydet = async () => {
        if (!secilenHasta) return Alert.alert("Uyarı", "Hasta seçiniz");
        if (!secilenSaat)  return Alert.alert("Uyarı", "Saat seçiniz");
        if (!secilenTip)   return Alert.alert("Uyarı", "Randevu tipi seçiniz");

        setSaving(true);
        const sonuc = await randevuOlustur({
            hastaId: secilenHasta.id!,
            hastaAdSoyad: secilenHasta.adSoyad,
            tarih: secilenTarih,
            saat: secilenSaat,
            tip: secilenTip as RandevuTipi,
            durum: "bekliyor",
            notlar: notlar.trim() || undefined,
        });
        setSaving(false);

        if (sonuc) {
            router.dismissAll();
            // Oluşturulan randevunun tarihini calendar'a parametre olarak geç
            router.replace({ pathname: "/(tabs)/calendar", params: { initialTarih: secilenTarih } });
        } else {
            Alert.alert("Hata", "Randevu oluşturulamadı. Lütfen tekrar deneyin.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Yeni Randevu</Text>
                <TouchableOpacity
                    style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                    onPress={handleKaydet}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.saveBtnText}>Kaydet</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Hasta Seçimi */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Hasta</Text>
                    <TouchableOpacity
                        style={styles.selectBox}
                        onPress={() => {
                            setHastaDropdown(!hastaDropdown);
                            setHastaArama("");
                        }}
                    >
                        {hastaLoading ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <>
                                <Ionicons name="person-outline" size={18} color={T.textSec} />
                                <Text
                                    style={[
                                        styles.selectBoxText,
                                        secilenHasta && { color: COLORS.text },
                                    ]}
                                >
                                    {secilenHasta ? secilenHasta.adSoyad : "Hasta seçin..."}
                                </Text>
                                <Ionicons
                                    name={hastaDropdown ? "chevron-up" : "chevron-down"}
                                    size={18}
                                    color={T.textSec}
                                />
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
                            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                                {filtreliHastalar.length === 0 ? (
                                    <Text style={styles.emptyDropdown}>Hasta bulunamadı</Text>
                                ) : (
                                    filtreliHastalar.map((h) => (
                                        <TouchableOpacity
                                            key={h.id}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setSecilenHasta(h);
                                                setHastaDropdown(false);
                                            }}
                                        >
                                            <View style={styles.dropdownAvatar}>
                                                <Text style={styles.dropdownAvatarText}>
                                                    {h.adSoyad.charAt(0)}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={styles.dropdownItemName}>{h.adSoyad}</Text>
                                                <Text style={styles.dropdownItemSub}>{h.eposta}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Tarih Seçimi */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Tarih</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
                        {days.map((day) => {
                            const dateObj = new Date(day + "T00:00:00");
                            const dayName = DAY_NAMES[dateObj.getDay()];
                            const dayNum = dateObj.getDate();
                            const isSelected = day === secilenTarih;
                            const isToday = day === formatDate(new Date());
                            return (
                                <TouchableOpacity
                                    key={day}
                                    style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                                    onPress={() => setSecilenTarih(day)}
                                >
                                    <Text
                                        style={[
                                            styles.dayName,
                                            isSelected && styles.dayNameSelected,
                                        ]}
                                    >
                                        {dayName}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.dayNum,
                                            isSelected && styles.dayNumSelected,
                                        ]}
                                    >
                                        {dayNum}
                                    </Text>
                                    {isToday && (
                                        <View
                                            style={[
                                                styles.todayDot,
                                                isSelected && { backgroundColor: "#fff" },
                                            ]}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <Text style={styles.selectedDateText}>
                        <Ionicons name="calendar-outline" size={13} color={T.textSec} />{" "}
                        {displayDate(secilenTarih)}
                    </Text>
                </View>

                {/* Saat Seçimi */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Saat</Text>
                    <View style={styles.timeGrid}>
                        {SAATLER.map((saat) => {
                            const isSelected = saat === secilenSaat;
                            return (
                                <TouchableOpacity
                                    key={saat}
                                    style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                                    onPress={() => setSecilenSaat(saat)}
                                >
                                    <Text
                                        style={[
                                            styles.timeChipText,
                                            isSelected && styles.timeChipTextSelected,
                                        ]}
                                    >
                                        {saat}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Randevu Tipi */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Randevu Tipi</Text>
                    <View style={styles.tipGrid}>
                        {RANDEVU_TIPLERI.map((tip) => {
                            const isSelected = tip === secilenTip;
                            return (
                                <TouchableOpacity
                                    key={tip}
                                    style={[styles.tipChip, isSelected && styles.tipChipSelected]}
                                    onPress={() => setSecilenTip(tip)}
                                >
                                    <Text
                                        style={[
                                            styles.tipChipText,
                                            isSelected && styles.tipChipTextSelected,
                                        ]}
                                    >
                                        {tip}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Notlar */}
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <Text style={styles.sectionLabel}>Notlar (opsiyonel)</Text>
                    <TextInput
                        style={styles.notlarInput}
                        placeholder="Randevu ile ilgili not ekleyin..."
                        placeholderTextColor={T.textSec}
                        multiline
                        numberOfLines={4}
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
    saveBtn: { backgroundColor: T.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, minWidth: 70, alignItems: "center" },
    saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    scroll: { flex: 1 },
    section: {
        backgroundColor: T.card, marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    },
    sectionLabel: { fontSize: 13, fontWeight: "600", color: T.textSec, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
    selectBox: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderColor: T.border, borderRadius: 12, padding: 14, backgroundColor: T.bg },
    selectBoxText: { flex: 1, fontSize: 15, color: T.textSec },
    dropdown: { marginTop: 8, borderWidth: 1.5, borderColor: T.border, borderRadius: 12, overflow: "hidden", backgroundColor: T.card },
    searchRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderBottomWidth: 1, borderBottomColor: T.border },
    searchInput: { flex: 1, fontSize: 14, color: T.text },
    emptyDropdown: { padding: 16, textAlign: "center", color: T.textSec, fontSize: 14 },
    dropdownItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderBottomWidth: 1, borderBottomColor: T.bg },
    dropdownAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: T.primaryLight, justifyContent: "center", alignItems: "center" },
    dropdownAvatarText: { fontWeight: "700", color: T.primary, fontSize: 15 },
    dropdownItemName: { fontSize: 14, fontWeight: "600", color: T.text },
    dropdownItemSub: { fontSize: 12, color: T.textSec, marginTop: 1 },
    dayScroll: { marginBottom: 10 },
    dayCard: { alignItems: "center", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, marginRight: 8, backgroundColor: T.bg, borderWidth: 1.5, borderColor: T.border, minWidth: 52 },
    dayCardSelected: { backgroundColor: T.primary, borderColor: T.primary },
    dayName: { fontSize: 11, color: T.textSec, fontWeight: "600", marginBottom: 4 },
    dayNameSelected: { color: "rgba(255,255,255,0.8)" },
    dayNum: { fontSize: 20, fontWeight: "700", color: T.text },
    dayNumSelected: { color: "#fff" },
    todayDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: T.primary, marginTop: 4 },
    selectedDateText: { fontSize: 13, color: T.textSec, marginTop: 4 },
    timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    timeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: T.border, backgroundColor: T.bg },
    timeChipSelected: { backgroundColor: T.primary, borderColor: T.primary },
    timeChipText: { fontSize: 13, fontWeight: "600", color: T.textSec },
    timeChipTextSelected: { color: "#fff" },
    tipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tipChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: T.border, backgroundColor: T.bg },
    tipChipSelected: { backgroundColor: T.primaryLight, borderColor: T.primary },
    tipChipText: { fontSize: 13, fontWeight: "600", color: T.textSec },
    tipChipTextSelected: { color: T.primary },
    notlarInput: { borderWidth: 1.5, borderColor: T.border, borderRadius: 12, padding: 14, fontSize: 14, color: T.text, backgroundColor: T.bg, minHeight: 100 },
});
