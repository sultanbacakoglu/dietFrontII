import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { getHastalar, hastaEkle, Hasta } from "../services/api";

const COLORS = {
  primary: "#6366F1",
  secondary: "#EC4899",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};

const avatars = ["#FEE2E2", "#FEF3C7", "#D1FAE5", "#DBEAFE", "#E0E7FF", "#FCE7F3"];

function getAvatarColor(id?: number) {
  return avatars[(id || 0) % avatars.length];
}

export default function Dashboard() {
  const [hastalar, setHastalar] = useState<Hasta[]>([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getHastalar();
      setHastalar(data);
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
            <Ionicons name="person-circle" size={48} color={COLORS.primary} />
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
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Bugünkü Randevu</Text>
          </View>
        </View>

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

        {hastalar.length === 0 ? (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
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
    color: "#64748B",
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E293B",
  },
  profileBtn: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 26,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
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
    color: "#1E293B",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
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
    backgroundColor: "#fff",
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
    color: "#1E293B",
    marginBottom: 2,
  },
  patientEmail: {
    fontSize: 13,
    color: "#64748B",
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
    backgroundColor: "#fff",
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
    color: "#374151",
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
    backgroundColor: "#F8FAFC",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#1E293B",
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
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
});
