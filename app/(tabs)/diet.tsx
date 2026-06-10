import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getDiyetPlanlari, DiyetPlani } from "../../services/dietService";
import { useTheme } from "../../contexts/ThemeContext";
import { Theme } from "../../constants/theme";


// DURUM_RENK component içinde hesaplanır (tema duyarlı)

const FILTRELER = ["aktif", "tamamlandı"];

export default function DietScreen() {
    const { T } = useTheme();
    const C = T;
    const styles = useMemo(() => createStyles(T), [T]);
    const DURUM_RENK: Record<string, { bg: string; text: string }> = { "aktif": { bg: T.successLight, text: T.success }, "tamamlandı": { bg: T.primaryLight, text: T.primary }, "taslak": { bg: T.border, text: T.textSec } };
    const router = useRouter();
    const [planlar, setPlanlar] = useState<DiyetPlani[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [arama, setArama] = useState("");
    const [filtre, setFiltre] = useState<string | null>(null);

    const fetchPlanlar = useCallback(async () => {
        setLoading(true);
        const data = await getDiyetPlanlari();
        setPlanlar(data);
        setLoading(false);
    }, []);

    useFocusEffect(useCallback(() => { fetchPlanlar(); }, []));

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const data = await getDiyetPlanlari();
        setPlanlar(data);
        setRefreshing(false);
    }, []);

    const gosterilen = planlar
        .filter((p) => filtre === null || p.durum === filtre)
        .filter((p) =>
            arama === "" ||
            p.baslik.toLowerCase().includes(arama.toLowerCase()) ||
            (p.hastaAdSoyad ?? "").toLowerCase().includes(arama.toLowerCase())
        );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSub}>Yönetim</Text>
                    <Text style={styles.headerTitle}>Diyet Planları</Text>
                </View>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push("/diet/create")}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Arama */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={16} color={T.textSec} style={{ marginLeft: 12 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Plan veya hasta ara..."
                    placeholderTextColor={T.textSec}
                    value={arama}
                    onChangeText={setArama}
                />
            </View>

            {/* Filtreler */}
            <View style={styles.filtreler}>
                {FILTRELER.map((f) => {
                    const aktif = filtre === f;
                    const renk = DURUM_RENK[f];
                    return (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filtreChip, aktif && { backgroundColor: renk.bg, borderColor: renk.text }]}
                            onPress={() => setFiltre(aktif ? null : f)}
                        >
                            <Text style={[styles.filtreText, aktif && { color: renk.text }]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
            >
                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={C.primary} />
                    </View>
                ) : gosterilen.length === 0 ? (
                    <View style={styles.empty}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="nutrition-outline" size={40} color={T.textSec} />
                        </View>
                        <Text style={styles.emptyTitle}>Plan Bulunamadı</Text>
                        <Text style={styles.emptyDesc}>
                            {arama ? "Arama kriterinize uygun plan yok." : "Henüz diyet planı oluşturulmamış."}
                        </Text>
                        {!arama && (
                            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push("/diet/create")}>
                                <Ionicons name="add" size={16} color="#fff" />
                                <Text style={styles.emptyBtnText}>Plan Oluştur</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <View style={styles.liste}>
                        {gosterilen.map((plan) => {
                            const dr = DURUM_RENK[plan.durum ?? "taslak"] ?? DURUM_RENK["taslak"];
                            const sure = plan.baslangicTarihi && plan.bitisTarihi
                                ? Math.ceil((new Date(plan.bitisTarihi).getTime() - new Date(plan.baslangicTarihi).getTime()) / 86400000)
                                : null;
                            return (
                                <TouchableOpacity
                                    key={plan.id}
                                    style={styles.planKart}
                                    onPress={() => router.push({ pathname: "/diet/[id]", params: { id: String(plan.id) } })}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.planKartUst}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.planBaslik} numberOfLines={1}>{plan.baslik}</Text>
                                            <View style={styles.planMeta}>
                                                <Ionicons name="person-outline" size={12} color={T.textSec} />
                                                <Text style={styles.planMetaText}>{plan.hastaAdSoyad ?? "-"}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.durumBadge, { backgroundColor: dr.bg }]}>
                                            <Text style={[styles.durumText, { color: dr.text }]}>{plan.durum ?? "taslak"}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.planKartAlt}>
                                        <View style={styles.planBilgi}>
                                            <Ionicons name="calendar-outline" size={12} color={T.textSec} />
                                            <Text style={styles.planBilgiText}>
                                                {plan.baslangicTarihi?.slice(5).replace("-", "/")} — {plan.bitisTarihi?.slice(5).replace("-", "/")}
                                            </Text>
                                        </View>
                                        {sure && (
                                            <View style={styles.planBilgi}>
                                                <Ionicons name="time-outline" size={12} color={T.textSec} />
                                                <Text style={styles.planBilgiText}>{sure} gün</Text>
                                            </View>
                                        )}
                                        {plan.kaloriHedefi && (
                                            <View style={styles.planBilgi}>
                                                <Ionicons name="flame-outline" size={12} color={T.textSec} />
                                                <Text style={styles.planBilgiText}>{plan.kaloriHedefi} kcal</Text>
                                            </View>
                                        )}
                                        <Ionicons name="chevron-forward" size={16} color={C.border} style={{ marginLeft: "auto" }} />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (T: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: T.bg },
    header: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, backgroundColor: T.card,
    },
    headerSub: { fontSize: 13, color: T.textSec, marginBottom: 2 },
    headerTitle: { fontSize: 22, fontWeight: "700", color: T.text },
    addBtn: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: T.primary,
        justifyContent: "center", alignItems: "center",
        shadowColor: T.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    searchContainer: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: T.card, marginHorizontal: 16, marginTop: 12,
        borderRadius: 12, borderWidth: 1.5, borderColor: T.border,
    },
    searchInput: { flex: 1, padding: 12, fontSize: 14, color: T.text },
    filtreler: {
        flexDirection: "row",
        paddingHorizontal: 16,
        gap: 8,
        marginTop: 10,
        marginBottom: 4,
    },
    filtreChip: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: T.border,
        backgroundColor: T.card,
        alignItems: "center",
    },
    filtreText: { fontSize: 13, fontWeight: "600", color: T.textSec },
    centered: { paddingTop: 80, alignItems: "center" },
    empty: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
    emptyIcon: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: "#F1F5F9",
        justifyContent: "center", alignItems: "center", marginBottom: 16,
    },
    emptyTitle: { fontSize: 18, fontWeight: "700", color: T.text, marginBottom: 6 },
    emptyDesc: { fontSize: 14, color: T.textSec, textAlign: "center", marginBottom: 24 },
    emptyBtn: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: T.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
    },
    emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    liste: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100, gap: 10 },
    planKart: {
        backgroundColor: T.card, borderRadius: 16, padding: 16,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    planKartUst: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
    planBaslik: { fontSize: 15, fontWeight: "700", color: T.text, marginBottom: 4 },
    planMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
    planMetaText: { fontSize: 12, color: T.textSec },
    durumBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8, marginLeft: 8 },
    durumText: { fontSize: 11, fontWeight: "700" },
    planKartAlt: { flexDirection: "row", alignItems: "center", gap: 12, flexWrap: "wrap" },
    planBilgi: { flexDirection: "row", alignItems: "center", gap: 4 },
    planBilgiText: { fontSize: 12, color: T.textSec },
});
