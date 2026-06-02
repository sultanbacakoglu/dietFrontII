import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getDiyetPlaniById, diyetPlaniSil, diyetPlaniGuncelle, DiyetPlani } from "../../services/dietService";
import { T, DURUM_COLORS } from "../../constants/theme";

const C = { primary: T.primary, success: T.success, danger: T.danger, bg: T.bg, card: T.card, text: T.text, muted: T.textSec, border: T.border };

const PLAN_DURUM_COLORS: Record<string, { bg: string; text: string }> = {
    "aktif":      { bg: T.successLight, text: T.success },
    "tamamlandı": { bg: T.primaryLight,  text: T.primary },
    "taslak":     { bg: "#F1F5F9",       text: T.textSec },
};

function Section({ title, content }: { title: string; content?: string }) {
    if (!content) return null;
    return (
        <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>{title}</Text>
            <Text style={styles.detailText}>{content}</Text>
        </View>
    );
}

export default function DietPlanDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [plan, setPlan] = useState<DiyetPlani | null>(null);
    const [loading, setLoading] = useState(true);
    const [silOnay, setSilOnay] = useState(false);

    useEffect(() => {
        if (!id) return;
        getDiyetPlaniById(Number(id)).then((data) => {
            setPlan(data);
            setLoading(false);
        });
    }, [id]);

    const handleDurumToggle = () => {
        if (!plan) return;
        const yeni = plan.durum === "aktif" ? "tamamlandı" : "aktif";
        diyetPlaniGuncelle(Number(id), { durum: yeni as any }).then((sonuc) => {
            if (sonuc) setPlan({ ...plan, durum: yeni as any });
        });
    };

    const handleSil = () => {
        if (silOnay) {
            diyetPlaniSil(Number(id)).then((ok) => {
                if (ok) {
                    router.dismissAll();
                    router.replace("/(tabs)/diet");
                } else {
                    Alert.alert("Hata", "Plan silinemedi.");
                }
            });
        } else {
            setSilOnay(true);
            setTimeout(() => setSilOnay(false), 3000);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg }}>
                <ActivityIndicator size="large" color={C.primary} />
            </View>
        );
    }

    if (!plan) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={C.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Plan Bulunamadı</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>
        );
    }

    const durumRenk = PLAN_DURUM_COLORS[plan.durum ?? "taslak"] ?? PLAN_DURUM_COLORS["taslak"];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={C.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>Diyet Planı</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.headerBtn, { backgroundColor: silOnay ? T.dangerLight : "#F1F5F9" }]}
                        onPress={handleSil}
                    >
                        <Ionicons name={silOnay ? "trash" : "trash-outline"} size={18} color={silOnay ? C.danger : C.muted} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Başlık kartı */}
                <View style={styles.heroCard}>
                    <View style={styles.heroTop}>
                        <View style={[styles.durumBadge, { backgroundColor: durumRenk.bg }]}>
                            <Text style={[styles.durumText, { color: durumRenk.text }]}>{plan.durum ?? "taslak"}</Text>
                        </View>
                        <TouchableOpacity style={styles.durumBtn} onPress={handleDurumToggle}>
                            <Ionicons name="swap-horizontal-outline" size={15} color={C.primary} />
                            <Text style={styles.durumBtnText}>
                                {plan.durum === "aktif" ? "Tamamlandı işaretle" : "Aktife al"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.heroTitle}>{plan.baslik}</Text>
                    {plan.aciklama ? <Text style={styles.heroDesc}>{plan.aciklama}</Text> : null}

                    <View style={styles.heroMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="person-outline" size={14} color={C.muted} />
                            <Text style={styles.metaText}>{plan.hastaAdSoyad ?? "-"}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={14} color={C.muted} />
                            <Text style={styles.metaText}>{plan.baslangicTarihi} → {plan.bitisTarihi}</Text>
                        </View>
                        {plan.kaloriHedefi ? (
                            <View style={styles.metaItem}>
                                <Ionicons name="flame-outline" size={14} color={C.muted} />
                                <Text style={styles.metaText}>{plan.kaloriHedefi} kcal/gün</Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* Öğünler */}
                {(plan.kahvalti || plan.ogleYemegi || plan.aksamYemegi || plan.araOgun) && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Öğün Planı</Text>
                        <Section title="☀️  Kahvaltı" content={plan.kahvalti} />
                        <Section title="🥗  Öğle Yemeği" content={plan.ogleYemegi} />
                        <Section title="🌙  Akşam Yemeği" content={plan.aksamYemegi} />
                        <Section title="🍎  Ara Öğün" content={plan.araOgun} />
                    </View>
                )}

                {plan.notlar && (
                    <View style={[styles.card, { marginBottom: 40 }]}>
                        <Text style={styles.cardTitle}>Ek Notlar</Text>
                        <Text style={styles.detailText}>{plan.notlar}</Text>
                    </View>
                )}
            </ScrollView>
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
    headerTitle: { flex: 1, fontSize: 17, fontWeight: "700", color: C.text, marginHorizontal: 8 },
    headerActions: { flexDirection: "row", gap: 8 },
    headerBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
    heroCard: {
        backgroundColor: C.card, margin: 16, borderRadius: 18, padding: 20,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    },
    heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    durumBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    durumText: { fontSize: 12, fontWeight: "700" },
    durumBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    durumBtnText: { fontSize: 12, color: C.primary, fontWeight: "600" },
    heroTitle: { fontSize: 20, fontWeight: "700", color: C.text, marginBottom: 6 },
    heroDesc: { fontSize: 14, color: C.muted, marginBottom: 14, lineHeight: 20 },
    heroMeta: { gap: 6 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    metaText: { fontSize: 13, color: C.muted },
    card: {
        backgroundColor: C.card, marginHorizontal: 16, marginBottom: 12,
        borderRadius: 16, padding: 16,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    },
    cardTitle: { fontSize: 15, fontWeight: "700", color: C.text, marginBottom: 14 },
    detailSection: { marginBottom: 14 },
    detailLabel: { fontSize: 12, fontWeight: "600", color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 },
    detailText: { fontSize: 14, color: C.text, lineHeight: 22 },
});
