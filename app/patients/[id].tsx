import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getHastaById, hastaSil, Hasta } from "../../services/api";
import { T } from "../../constants/theme";

const COLORS = {
  primary: T.primary,
  secondary: T.pink,
  success: T.success,
  warning: T.warning,
  danger: T.danger,
  purple: T.purple,
  cyan: T.accent,
  teal: "#14B8A6",
};

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hasta, setHasta] = useState<Hasta | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHasta = async () => {
      if (id) {
        const data = await getHastaById(Number(id));
        setHasta(data);
      }
      setLoading(false);
    };
    fetchHasta();
  }, [id]);

  const handleSil = () => {
    Alert.alert(
      "Hasta Sil",
      "Bu hastayı silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            if (id) {
              const success = await hastaSil(Number(id));
              if (success) {
                router.back();
              } else {
                Alert.alert("Hata", "Hasta silinemedi");
              }
            }
          },
        },
      ]
    );
  };

  const handleAra = () => {
    if (hasta?.telefon) {
      Linking.openURL(`tel:${hasta.telefon.replace(/\s/g, "")}`);
    }
  };

  const handleMail = () => {
    if (hasta?.eposta) {
      Linking.openURL(`mailto:${hasta.eposta}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!hasta) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={T.textSec} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hasta Detay</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Hasta bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={T.textSec} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasta Detay</Text>
        <TouchableOpacity onPress={handleSil} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: T.primaryLight }]}>
            <Text style={[styles.avatarText, { color: COLORS.primary }]}>
              {hasta.adSoyad.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{hasta.adSoyad}</Text>
          <View style={[styles.emailBadge, { backgroundColor: T.bg }]}>
            <Ionicons name="mail-outline" size={14} color={T.textSec} />
            <Text style={styles.email}>{hasta.eposta}</Text>
          </View>

          <View style={styles.actionRow}>
            {hasta.telefon && (
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#D1FAE5" }]} onPress={handleAra}>
                <View style={[styles.actionIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="call" size={20} color={COLORS.success} />
                </View>
                <Text style={[styles.actionText, { color: "#065F46" }]}>Ara</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#E0E7FF" }]} onPress={handleMail}>
              <View style={[styles.actionIcon, { backgroundColor: "#EEF2FF" }]}>
                <Ionicons name="mail" size={20} color={COLORS.primary} />
              </View>
              <Text style={[styles.actionText, { color: "#4338CA" }]}>E-posta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FCE7F3" }]}>
              <View style={[styles.actionIcon, { backgroundColor: "#FDF2F8" }]}>
                <Ionicons name="chatbubbles" size={20} color={COLORS.secondary} />
              </View>
              <Text style={[styles.actionText, { color: "#BE185D" }]}>Mesaj</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          <View style={styles.card}>
            <InfoRow 
              icon="call-outline" 
              iconColor="#10B981"
              iconBg="#D1FAE5"
              label="Telefon" 
              value={hasta.telefon || "Belirtilmedi"} 
            />
            <InfoRow 
              icon="calendar-outline" 
              iconColor="#8B5CF6"
              iconBg="#EDE9FE"
              label="Doğum Tarihi" 
              value={hasta.dogumTarihi || "Belirtilmedi"} 
            />
            <InfoRow 
              icon="male-female-outline" 
              iconColor="#EC4899"
              iconBg="#FCE7F3"
              label="Cinsiyet" 
              value={hasta.cinsiyet || "Belirtilmedi"} 
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fiziksel Özellikler</Text>
          <View style={styles.physicalRow}>
            <View style={[styles.physicalCard, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="resize-outline" size={24} color="#D97706" />
              <Text style={[styles.physicalValue, { color: "#92400E" }]}>
                {hasta.boy ? `${hasta.boy} cm` : "-"}
              </Text>
              <Text style={[styles.physicalLabel, { color: "#B45309" }]}>Boy</Text>
            </View>
            <View style={[styles.physicalCard, { backgroundColor: "#D1FAE5" }]}>
              <Ionicons name="fitness-outline" size={24} color="#059669" />
              <Text style={[styles.physicalValue, { color: "#065F46" }]}>
                {hasta.kilo ? `${hasta.kilo} kg` : "-"}
              </Text>
              <Text style={[styles.physicalLabel, { color: "#047857" }]}>Kilo</Text>
            </View>
          </View>
        </View>

        {hasta.sikayet && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Şikayet</Text>
            <View style={[styles.card, styles.noteCard, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="alert-circle" size={20} color="#D97706" style={{ marginRight: 8 }} />
              <Text style={[styles.noteText, { color: "#92400E" }]}>{hasta.sikayet}</Text>
            </View>
          </View>
        )}

        {hasta.notlar && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notlar</Text>
            <View style={[styles.card, styles.noteCard, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="document-text" size={20} color="#6366F1" style={{ marginRight: 8 }} />
              <Text style={[styles.noteText, { color: "#4338CA" }]}>{hasta.notlar}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, iconColor, iconBg, label, value, isLast }: { 
  icon: string; 
  iconColor: string;
  iconBg: string;
  label: string; 
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
      <View style={[styles.infoIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.card,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: T.text,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: T.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: T.text,
    marginBottom: 8,
  },
  emailBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 20,
  },
  email: {
    fontSize: 14,
    color: T.textSec,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: T.textMuted,
    marginBottom: 10,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: T.card,
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: T.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: T.text,
    fontWeight: "500",
  },
  physicalRow: {
    flexDirection: "row",
    gap: 12,
  },
  physicalCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  physicalValue: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 2,
  },
  physicalLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
});
