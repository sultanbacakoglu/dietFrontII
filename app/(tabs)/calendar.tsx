import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getRandevular, randevuSil, randevuGuncelle, Randevu } from "../../services/appointmentService";
import { T, TIP_COLORS, DURUM_COLORS } from "../../constants/theme";

const COLORS = {
    primary: T.primary,
    success: T.success,
    warning: T.warning,
    danger: T.danger,
    bg: T.bg,
    card: T.card,
    text: T.text,
    muted: T.textSec,
    border: T.border,
};

const DAY_NAMES_SHORT = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function getWeekDays(anchor: Date): Date[] {
    const days: Date[] = [];
    for (let i = -3; i <= 3; i++) {
        const d = new Date(anchor);
        d.setDate(anchor.getDate() + i);
        days.push(d);
    }
    return days;
}

export default function CalendarScreen() {
    const router = useRouter();
    const { initialTarih } = useLocalSearchParams<{ initialTarih?: string }>();

    const [anchor, setAnchor] = useState(new Date());
    const [secilenTarih, setSecilenTarih] = useState(formatDate(new Date()));
    const [tumRandevular, setTumRandevular] = useState<Randevu[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [silOnayId, setSilOnayId] = useState<number | null>(null);

    const weekDays = getWeekDays(anchor);

    const fetchTumu = useCallback(async () => {
        setLoading(true);
        const data = await getRandevular();
        setTumRandevular(data);
        setLoading(false);
    }, []);

    useFocusEffect(useCallback(() => {
        fetchTumu();
    }, []));

    useEffect(() => {
        if (!initialTarih) return;
        setSecilenTarih(initialTarih);
        setAnchor(new Date(initialTarih + "T00:00:00"));
    }, [initialTarih]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const data = await getRandevular();
        setTumRandevular(data);
        setRefreshing(false);
    }, []);

    const gunRandevulari = tumRandevular
        .filter((r) => r.tarih === secilenTarih)
        .sort((a, b) => (a.saat ?? "").localeCompare(b.saat ?? ""));

    const randevuluGunler = new Set(tumRandevular.map((r) => r.tarih));

    const handleGunSec = (date: Date) => {
        setSecilenTarih(formatDate(date));
    };

    const handleHaftaGeri = () => {
        const d = new Date(anchor);
        d.setDate(anchor.getDate() - 7);
        setAnchor(d);
    };

    const handleHaftaIleri = () => {
        const d = new Date(anchor);
        d.setDate(anchor.getDate() + 7);
        setAnchor(d);
    };

    const handleOnayla = (randevuId: number) => {
        const r = tumRandevular.find((x) => x.id === randevuId);
        if (!r) return;
        const yeniDurum = r.durum === "tamamlandı" ? "bekliyor" : "tamamlandı";
        randevuGuncelle(randevuId, { durum: yeniDurum as any }).then((sonuc) => {
            if (sonuc) {
                setTumRandevular((prev) =>
                    prev.map((x) => x.id === randevuId ? { ...x, durum: yeniDurum as any } : x)
                );
            }
        });
    };

    const handleSilBasin = (randevuId: number) => {
        if (silOnayId === randevuId) {
            randevuSil(randevuId).then((ok) => {
                if (ok) {
                    setTumRandevular((prev) => prev.filter((x) => x.id !== randevuId));
                    setSilOnayId(null);
                }
            });
        } else {
            setSilOnayId(randevuId);
            setTimeout(() => setSilOnayId((cur) => cur === randevuId ? null : cur), 3000);
        }
    };

    const selectedDate = new Date(secilenTarih + "T00:00:00");
    const isToday = secilenTarih === formatDate(new Date());

    return (
        <SafeAreaView style={styles.container}>
            {/* Başlık */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSub}>Randevular</Text>
                    <Text style={styles.headerTitle}>
                        {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push("/appointments/create")}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Hafta Seçici */}
            <View style={styles.weekContainer}>
                <TouchableOpacity onPress={handleHaftaGeri} style={styles.weekNavBtn}>
                    <Ionicons name="chevron-back" size={18} color={COLORS.muted} />
                </TouchableOpacity>
                <View style={styles.weekDays}>
                    {weekDays.map((day, i) => {
                        const dateStr = formatDate(day);
                        const isSelected = dateStr === secilenTarih;
                        const isTodayDay = dateStr === formatDate(new Date());
                        const hasRandevu = randevuluGunler.has(dateStr);
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[styles.dayBtn, isSelected && styles.dayBtnSelected]}
                                onPress={() => handleGunSec(day)}
                            >
                                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                                    {DAY_NAMES_SHORT[day.getDay()]}
                                </Text>
                                <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                                    {day.getDate()}
                                </Text>
                                {(isTodayDay || hasRandevu) && (
                                    <View style={[
                                        styles.dayDot,
                                        { backgroundColor: isSelected ? "#fff" : (isTodayDay ? COLORS.primary : COLORS.success) }
                                    ]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <TouchableOpacity onPress={handleHaftaIleri} style={styles.weekNavBtn}>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
                </TouchableOpacity>
            </View>

            {/* Seçili Gün Başlığı */}
            <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>
                    {isToday ? "Bugün" : `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`}
                </Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{gunRandevulari.length}</Text>
                </View>
            </View>

            {/* Randevu Listesi */}
            <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : gunRandevulari.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="calendar-outline" size={40} color={COLORS.muted} />
                        </View>
                        <Text style={styles.emptyTitle}>Randevu Yok</Text>
                        <Text style={styles.emptyDesc}>
                            {isToday ? "Bugün için" : "Bu gün için"} randevu bulunmuyor
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyBtn}
                            onPress={() => router.push("/appointments/create")}
                        >
                            <Ionicons name="add" size={16} color="#fff" />
                            <Text style={styles.emptyBtnText}>Randevu Oluştur</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.appointmentList}>
                        {gunRandevulari.map((randevu) => {
                            const tipRenk = TIP_COLORS[randevu.tip] ?? TIP_COLORS["Diğer"];
                            const durumRenk = DURUM_COLORS[randevu.durum ?? "bekliyor"] ?? DURUM_COLORS["bekliyor"];
                            const onayModu = silOnayId === randevu.id;
                            const tamamlandi = randevu.durum === "tamamlandı";
                            return (
                                <View key={randevu.id} style={styles.card}>
                                    <View style={[styles.cardStripe, { backgroundColor: tipRenk.text }]} />
                                    <View style={styles.cardContent}>
                                        {/* Üst: avatar + isim + saat */}
                                        <View style={styles.cardTop}>
                                            <View style={[styles.avatar, { backgroundColor: tipRenk.bg }]}>
                                                <Text style={[styles.avatarText, { color: tipRenk.text }]}>
                                                    {(randevu.hastaAdSoyad ?? "?")
                                                        .split(" ").slice(0, 2)
                                                        .map((w: string) => w.charAt(0))
                                                        .join("").toUpperCase()}
                                                </Text>
                                            </View>
                                            <Text style={styles.cardPatient} numberOfLines={1}>
                                                {randevu.hastaAdSoyad ?? `Hasta #${randevu.hastaId}`}
                                            </Text>
                                            <View style={[styles.saatBadge, { backgroundColor: tipRenk.bg }]}>
                                                <Ionicons name="time-outline" size={11} color={tipRenk.text} />
                                                <Text style={[styles.saatBadgeText, { color: tipRenk.text }]}>
                                                    {randevu.saat}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Alt: etiketler + butonlar aynı satırda */}
                                        <View style={styles.cardBottom}>
                                            <View style={styles.cardTags}>
                                                <View style={[styles.tag, { backgroundColor: tipRenk.bg }]}>
                                                    <Text style={[styles.tagText, { color: tipRenk.text }]}>{randevu.tip}</Text>
                                                </View>
                                                <View style={[styles.tag, { backgroundColor: durumRenk.bg }]}>
                                                    <Text style={[styles.tagText, { color: durumRenk.text }]}>
                                                        {randevu.durum ?? "bekliyor"}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Küçük ikon butonlar — etiketlerin yanında */}
                                            <View style={styles.cardActions}>
                                                <TouchableOpacity
                                                    style={[styles.actionBtn,
                                                        { backgroundColor: tamamlandi ? "#D1FAE5" : "#F1F5F9" }]}
                                                    onPress={() => handleOnayla(randevu.id!)}
                                                    activeOpacity={0.6}
                                                >
                                                    <Ionicons
                                                        name={tamamlandi ? "checkmark-circle" : "checkmark-circle-outline"}
                                                        size={18}
                                                        color={tamamlandi ? COLORS.success : COLORS.muted}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.actionBtn,
                                                        { backgroundColor: onayModu ? "#FEE2E2" : "#F1F5F9" }]}
                                                    onPress={() => handleSilBasin(randevu.id!)}
                                                    activeOpacity={0.6}
                                                >
                                                    <Ionicons
                                                        name={onayModu ? "trash" : "trash-outline"}
                                                        size={16}
                                                        color={onayModu ? COLORS.danger : COLORS.muted}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {randevu.notlar ? (
                                            <Text style={styles.cardNote} numberOfLines={1}>{randevu.notlar}</Text>
                                        ) : null}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 14,
        backgroundColor: COLORS.card,
    },
    headerSub: { fontSize: 13, color: COLORS.muted, marginBottom: 2 },
    headerTitle: { fontSize: 22, fontWeight: "700", color: COLORS.text },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    weekContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        paddingHorizontal: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    weekNavBtn: { padding: 8, borderRadius: 20, backgroundColor: COLORS.bg },
    weekDays: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
    dayBtn: {
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 14,
        minWidth: 38,
    },
    dayBtnSelected: { backgroundColor: COLORS.primary },
    dayLabel: { fontSize: 11, fontWeight: "600", color: COLORS.muted, marginBottom: 4 },
    dayLabelSelected: { color: "rgba(255,255,255,0.8)" },
    dayNumber: { fontSize: 17, fontWeight: "700", color: COLORS.text },
    dayNumberSelected: { color: "#fff" },
    dayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 3 },
    listHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    listHeaderText: { fontSize: 16, fontWeight: "700", color: COLORS.text },
    countBadge: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    countBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
    list: { flex: 1 },
    centered: { paddingTop: 60, alignItems: "center" },
    emptyState: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
    emptyIcon: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: "#F1F5F9",
        justifyContent: "center", alignItems: "center", marginBottom: 16,
    },
    emptyTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
    emptyDesc: { fontSize: 14, color: COLORS.muted, textAlign: "center", marginBottom: 24 },
    emptyBtn: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
    },
    emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    appointmentList: { paddingHorizontal: 16, paddingBottom: 100, gap: 10 },
    card: {
        flexDirection: "row",
        backgroundColor: COLORS.card,
        borderRadius: 16,
        alignItems: "stretch",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    cardStripe: {
        width: 5,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    cardContent: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, gap: 8 },
    cardTop: { flexDirection: "row", alignItems: "center", gap: 8 },
    avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
    avatarText: { fontSize: 12, fontWeight: "800" },
    cardPatient: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.text },
    saatBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
    saatBadgeText: { fontSize: 12, fontWeight: "700" },
    cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    cardTags: { flexDirection: "row", gap: 5, flexWrap: "wrap", flex: 1 },
    tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 },
    tagText: { fontSize: 11, fontWeight: "600" },
    cardNote: { fontSize: 11, color: COLORS.muted },
    cardActions: { flexDirection: "row", gap: 6 },
    actionBtn: { width: 30, height: 30, borderRadius: 8, justifyContent: "center", alignItems: "center" },
});
