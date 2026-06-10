import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Theme } from "../../constants/theme";
import { getMe, Profil } from "../../services/authService";
import { getHastalar } from "../../services/api";
import { getRandevular } from "../../services/appointmentService";
import { getDiyetPlanlari } from "../../services/dietService";

export default function ProfileScreen() {
    const { T, isDark, toggleTheme } = useTheme();
    const COLORS = T;
    const styles = useMemo(() => createStyles(T), [T]);
  const router = useRouter();
  const [profil, setProfil] = useState<Profil | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [istatistik, setIstatistik] = useState({ hasta: 0, randevu: 0, plan: 0 });

  useFocusEffect(useCallback(() => {
    getMe().then(setProfil);
    Promise.all([getHastalar(), getRandevular(), getDiyetPlanlari()]).then(([h, r, p]) => {
      setIstatistik({ hasta: h.length, randevu: r.length, plan: p.length });
    });
  }, []));

  const handleLogoutConfirm = async () => {
    setLogoutModal(false);
    await AsyncStorage.multiRemove(["auth_token", "user_id", "user_name"]);
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.greeting}>Hesap</Text>
          <Text style={styles.title}>Profil</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={COLORS.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profil?.adSoyad ?? "Diyetisyen"}</Text>
          <View style={styles.emailBadge}>
            <Ionicons name="mail" size={14} color="#64748B" />
            <Text style={styles.emailText}>{profil?.eposta ?? "—"}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
            <Text style={styles.badgeText}>Onaylı Hesap</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{istatistik.hasta}</Text>
            <Text style={styles.statLabel}>Hasta</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{istatistik.randevu}</Text>
            <Text style={styles.statLabel}>Randevu</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{istatistik.plan}</Text>
            <Text style={styles.statLabel}>Diyet Planı</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Hesap</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => router.push("/profile/edit")}
            >
              <View style={[styles.menuIcon, { backgroundColor: T.primaryLight }]}>
                <Ionicons name="person-outline" size={20} color={T.primary} />
              </View>
              <Text style={styles.menuLabel}>Profili Düzenle</Text>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => router.push("/profile/edit")}
            >
              <View style={[styles.menuIcon, { backgroundColor: T.warningLight }]}>
                <Ionicons name="lock-closed-outline" size={20} color={T.warning} />
              </View>
              <Text style={styles.menuLabel}>Şifre Değiştir</Text>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
            <View style={[styles.menuItem, styles.menuItemBorder]}>
              <View style={[styles.menuIcon, { backgroundColor: isDark ? "#1E1B4B" : "#EEF2FF" }]}>
                <Ionicons name={isDark ? "moon" : "moon-outline"} size={20} color={T.primary} />
              </View>
              <Text style={styles.menuLabel}>Karanlık Mod</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: T.border, true: T.primary }}
                thumbColor="#fff"
              />
            </View>
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: T.primaryLight }]}>
                <Ionicons name="information-circle-outline" size={20} color={T.primary} />
              </View>
              <Text style={styles.menuLabel}>Hakkında</Text>
              <Ionicons name="chevron-forward" size={20} color={T.border} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setLogoutModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versiyon 1.0.0</Text>
      </ScrollView>

      {/* Çıkış Onay Modalı */}
      <Modal
        visible={logoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLogoutModal(false)}>
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out-outline" size={32} color={COLORS.danger} />
            </View>
            <Text style={styles.modalTitle}>Çıkış Yap</Text>
            <Text style={styles.modalDesc}>Hesabınızdan çıkmak istediğinize emin misiniz?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setLogoutModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.modalBtnConfirmText}>Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (T: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  header: {
    padding: 20,
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
  profileCard: {
    backgroundColor: T.card,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: T.text,
    marginBottom: 6,
  },
  emailBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  emailText: {
    fontSize: 14,
    color: "#64748B",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065F46",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: T.card,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: T.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: T.textSec,
  },
  statDivider: {
    width: 1,
    backgroundColor: T.border,
    marginVertical: 4,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: T.text,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: T.dangerLight,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: T.danger,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: T.textMuted,
    marginBottom: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalBox: {
    backgroundColor: T.card,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: T.dangerLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: T.text,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: T.textSec,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnCancel: {
    backgroundColor: "#F1F5F9",
  },
  modalBtnCancelText: {
    color: T.text,
    fontWeight: "600",
    fontSize: 15,
  },
  modalBtnConfirm: {
    backgroundColor: T.danger,
  },
  modalBtnConfirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
