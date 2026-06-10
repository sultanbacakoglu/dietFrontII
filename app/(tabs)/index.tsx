import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getHastalar, hastaEkle, hastaAra, Hasta } from "../../services/api";
import { getRandevular, Randevu } from "../../services/appointmentService";
import { useTheme } from "../../contexts/ThemeContext";
import { Theme } from "../../constants/theme";


const avatars = ["#FEE2E2", "#FEF3C7", "#D1FAE5", "#DBEAFE", "#E0E7FF", "#FCE7F3"];

function getAvatarColor(id?: number) {
  return avatars[(id || 0) % avatars.length];
}

export default function Dashboard() {
  const { T, TIP_COLORS, DURUM_COLORS } = useTheme();
  const COLORS = T;
  const styles = useMemo(() => createStyles(T), [T]);
  const [hastalar, setHastalar] = useState<Hasta[]>([]);
  const [aramaMetni, setAramaMetni] = useState("");
  const [aramaYukleniyor, setAramaYukleniyor] = useState(false);
  const [araSonuclari, setAraSonuclari] = useState<Hasta[] | null>(null);
  const [bugunRandevuSayisi, setBugunRandevuSayisi] = useState<number>(0);
  const [toplamRandevuSayisi, setToplamRandevuSayisi] = useState<number>(0);
  const [yaklasanRandevular, setYaklasanRandevular] = useState<Randevu[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    adSoyad: "",
    eposta: "",
    telefon: "",
    sikayet: "",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (aramaMetni.trim().length < 2) {
      setAraSonuclari(null);
      return;
    }
    setAramaYukleniyor(true);
    const timer = setTimeout(async () => {
      const sonuclar = await hastaAra(aramaMetni.trim());
      setAraSonuclari(sonuclar);
      setAramaYukleniyor(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [aramaMetni]);

  const fetchData = async () => {
    try {
      const [hastalarData, randevularData] = await Promise.all([
        getHastalar(),
        getRandevular(),
      ]);
      setHastalar(hastalarData);

      const bugun = new Date();
      const bugunStr = `${bugun.getFullYear()}-${String(bugun.getMonth() + 1).padStart(2, "0")}-${String(bugun.getDate()).padStart(2, "0")}`;
      setBugunRandevuSayisi(randevularData.filter((r) => r.tarih === bugunStr).length);
      setToplamRandevuSayisi(randevularData.length);

      const yaklaşan = randevularData
        .filter((r) => r.tarih >= bugunStr && r.durum !== "iptal")
        .sort((a, b) => `${a.tarih}${a.saat}`.localeCompare(`${b.tarih}${b.saat}`))
        .slice(0, 5);
      setYaklasanRandevular(yaklaşan);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEkle = async () => {
    if (!formData.adSoyad.trim() || !formData.eposta.trim()) {
      Alert.alert("Hata", "Ad Soyad ve E-posta gerekli");
      return;
    }

    setSaving(true);
    const result = await hastaEkle({
      adSoyad: formData.adSoyad,
      eposta: formData.eposta,
      telefon: formData.telefon || undefined,
      sikayet: formData.sikayet || undefined,
    });
    setSaving(false);

    if (result) {
      setModalVisible(false);
      setFormData({ adSoyad: "", eposta: "", telefon: "", sikayet: "" });
      fetchData();
      Alert.alert("Başarılı", "Hasta eklendi");
    } else {
      Alert.alert("Hata", "Hasta eklenemedi");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hoş Geldiniz</Text>
            <Text style={styles.title}>Diyetisyen Paneli</Text>
          </View>
          <View style={styles.profileBtn}>
            <Ionicons name="person-circle" size={48} color={T.primary} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
            <View style={[styles.statIcon, { backgroundColor: "#EEF2FF" }]}>
              <Ionicons name="people" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>{hastalar.length}</Text>
            <Text style={styles.statLabel}>Toplam Hasta</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
            <View style={[styles.statIcon, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="calendar" size={22} color={COLORS.success} />
            </View>
            <Text style={styles.statNumber}>{toplamRandevuSayisi}</Text>
            <Text style={styles.statLabel}>Toplam Randevu</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.warning }]}>
            <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="today" size={22} color={COLORS.warning} />
            </View>
            <Text style={styles.statNumber}>{bugunRandevuSayisi}</Text>
            <Text style={styles.statLabel}>Bugünkü</Text>
          </View>
        </View>

        {/* Yaklaşan Randevular */}
        {yaklasanRandevular.length > 0 && (
          <View style={styles.yaklasanSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Yaklaşan Randevular</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/calendar")}>
                <Text style={styles.tumunuGor}>Tümünü gör</Text>
              </TouchableOpacity>
            </View>
            {yaklasanRandevular.map((r) => {
              const tipRenk = TIP_COLORS[r.tip] ?? TIP_COLORS["Diğer"];
              const durumRenk = DURUM_COLORS[r.durum ?? "bekliyor"] ?? DURUM_COLORS["bekliyor"];
              const bugun = new Date();
              const bugunStr = `${bugun.getFullYear()}-${String(bugun.getMonth() + 1).padStart(2, "0")}-${String(bugun.getDate()).padStart(2, "0")}`;
              const etiket = r.tarih === bugunStr ? "Bugün" : r.tarih.slice(5).replace("-", "/");
              return (
                <TouchableOpacity
                  key={r.id}
                  style={styles.randevuKart}
                  onPress={() => router.push({ pathname: "/appointments/edit", params: { id: String(r.id) } })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.randevuStripe, { backgroundColor: tipRenk.text }]} />
                  <View style={[styles.randevuAvatar, { backgroundColor: tipRenk.bg }]}>
                    <Text style={[styles.randevuAvatarText, { color: tipRenk.text }]}>
                      {(r.hastaAdSoyad ?? "?").split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.randevuBilgi}>
                    <Text style={styles.randevuHasta} numberOfLines={1}>{r.hastaAdSoyad}</Text>
                    <Text style={styles.randevuAlt}>{r.tip}</Text>
                  </View>
                  <View style={styles.randevuSag}>
                    <Text style={[styles.randevuTarih, r.tarih === bugunStr && { color: T.primary, fontWeight: "700" }]}>
                      {etiket}
                    </Text>
                    <View style={[styles.randevuDurum, { backgroundColor: durumRenk.bg }]}>
                      <Text style={[styles.randevuDurumText, { color: durumRenk.text }]}>{r.saat}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hastalarım</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Yeni Hasta</Text>
          </TouchableOpacity>
        </View>

        {/* Hasta Arama */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={T.textSec} />
          <TextInput
            style={styles.searchBoxInput}
            placeholder="Ad, soyad veya e-posta ile ara..."
            placeholderTextColor={T.textMuted}
            value={aramaMetni}
            onChangeText={setAramaMetni}
            clearButtonMode="while-editing"
          />
          {aramaYukleniyor && <ActivityIndicator size="small" color={T.primary} />}
        </View>

        {araSonuclari !== null ? (
          <View style={styles.patientList}>
            {araSonuclari.length === 0 ? (
              <View style={[styles.emptyState, { paddingVertical: 24 }]}>
                <Ionicons name="search-outline" size={32} color={T.textMuted} />
                <Text style={[styles.emptyText, { marginTop: 8 }]}>Sonuç bulunamadı</Text>
              </View>
            ) : araSonuclari.map((hasta) => (
              <TouchableOpacity
                key={hasta.id}
                style={styles.patientCard}
                onPress={() => router.push(`/patients/${hasta.id}`)}
              >
                <View style={[styles.patientAvatar, { backgroundColor: getAvatarColor(hasta.id) }]}>
                  <Text style={[styles.patientInitial, { color: COLORS.primary }]}>
                    {hasta.adSoyad.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{hasta.adSoyad}</Text>
                  <Text style={styles.patientEmail}>{hasta.eposta}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        ) : hastalar.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: "#F3E8FF" }]}>
              <Ionicons name="people-outline" size={48} color={COLORS.purple} />
            </View>
            <Text style={styles.emptyText}>Henüz hasta kaydı yok</Text>
            <Text style={styles.emptySubtext}>Yeni hasta eklemek için yukarıdaki butonu kullanın</Text>
          </View>
        ) : (
          <View style={styles.patientList}>
            {hastalar.map((hasta, index) => (
              <TouchableOpacity
                key={hasta.id}
                style={styles.patientCard}
                onPress={() => router.push(`/patients/${hasta.id}`)}
              >
                <View style={[styles.patientAvatar, { backgroundColor: getAvatarColor(hasta.id) }]}>
                  <Text style={[styles.patientInitial, { color: COLORS.primary }]}>
                    {hasta.adSoyad.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{hasta.adSoyad}</Text>
                  <Text style={styles.patientEmail}>{hasta.eposta}</Text>
                  {hasta.telefon && (
                    <View style={styles.patientMeta}>
                      <Ionicons name="call-outline" size={12} color="#9CA3AF" />
                      <Text style={styles.patientPhone}>{hasta.telefon}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.chevronContainer}>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Yeni Hasta Ekle</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ad Soyad *</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Ahmet Yılmaz"
                placeholderTextColor="#9CA3AF"
                value={formData.adSoyad}
                onChangeText={(v) => setFormData({ ...formData, adSoyad: v })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta *</Text>
              <TextInput
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.eposta}
                onChangeText={(v) => setFormData({ ...formData, eposta: v })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon</Text>
              <TextInput
                style={styles.input}
                placeholder="0555 555 55 55"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={formData.telefon}
                onChangeText={(v) => setFormData({ ...formData, telefon: v })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şikayet / Not</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Hastanın şikayeti..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={formData.sikayet}
                onChangeText={(v) => setFormData({ ...formData, sikayet: v })}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleEkle}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (T: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: T.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: T.textSec,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: T.text,
  },
  profileBtn: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 26,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.card,
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: T.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: T.textSec,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: T.text,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  patientList: {
    gap: 12,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.card,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  patientAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  patientInitial: {
    fontSize: 22,
    fontWeight: "700",
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: T.text,
    marginBottom: 2,
  },
  patientEmail: {
    fontSize: 13,
    color: T.textSec,
  },
  patientMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  patientPhone: {
    fontSize: 12,
    color: "#94A3B8",
  },
  chevronContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    backgroundColor: T.card,
    borderRadius: 20,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: T.text,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: T.bg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: T.card,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: T.text,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    backgroundColor: T.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: T.border,
    color: T.text,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: T.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  searchBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: T.card, borderRadius: 12,
    borderWidth: 1.5, borderColor: T.border,
    paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 12,
  },
  searchBoxInput: { flex: 1, fontSize: 14, color: T.text },
  yaklasanSection: { marginBottom: 8 },
  tumunuGor: { fontSize: 13, color: T.primary, fontWeight: "600" },
  randevuKart: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.card,
    borderRadius: 14,
    marginBottom: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  randevuStripe: { width: 4, alignSelf: "stretch" },
  randevuAvatar: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: "center", alignItems: "center",
    marginHorizontal: 12,
  },
  randevuAvatarText: { fontSize: 14, fontWeight: "800" },
  randevuBilgi: { flex: 1, paddingVertical: 12 },
  randevuHasta: { fontSize: 14, fontWeight: "700", color: T.text, marginBottom: 2 },
  randevuAlt: { fontSize: 12, color: T.textSec },
  randevuSag: { alignItems: "flex-end", paddingRight: 14, gap: 4 },
  randevuTarih: { fontSize: 12, color: T.textSec },
  randevuDurum: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  randevuDurumText: { fontSize: 12, fontWeight: "700" },
});
