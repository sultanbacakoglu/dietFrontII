import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  primary: "#6366F1",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};

const appointments = [
  { id: 1, time: "09:00", patient: "Ahmet Yılmaz", type: "Kontrol", color: "#D1FAE5", iconColor: "#059669" },
  { id: 2, time: "10:30", patient: "Ayşe Demir", type: "İlk Görüşme", color: "#E0E7FF", iconColor: "#6366F1" },
  { id: 3, time: "14:00", patient: "Mehmet Kaya", type: "Kontrol", color: "#FEF3C7", iconColor: "#D97706" },
  { id: 4, time: "15:30", patient: "Fatma Şahin", type: "Tetkik Sonucu", color: "#FCE7F3", iconColor: "#DB2777" },
];

const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Randevular</Text>
            <Text style={styles.title}>Takvim</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.dateCard}>
          <View style={styles.dateLeft}>
            <Text style={styles.dayName}>Pazartesi</Text>
            <Text style={styles.dayNumber}>6</Text>
          </View>
          <View style={styles.dateRight}>
            <Text style={styles.monthYear}>Nisan 2026</Text>
            <View style={styles.dateNav}>
              <TouchableOpacity style={styles.navBtn}>
                <Ionicons name="chevron-back" size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}>
                <Ionicons name="chevron-forward" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: "#EEF2FF" }]}>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>4</Text>
            <Text style={styles.statLabel}>Bugünkü</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: "#D1FAE5" }]}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>12</Text>
            <Text style={styles.statLabel}>Bu Hafta</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: "#FEF3C7" }]}>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>48</Text>
            <Text style={styles.statLabel}>Bu Ay</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Bugün</Text>
        
        <View style={styles.appointmentList}>
          {appointments.map((apt) => (
            <View key={apt.id} style={styles.appointmentCard}>
              <View style={[styles.appointmentTime, { backgroundColor: apt.color }]}>
                <Text style={[styles.timeText, { color: apt.iconColor }]}>{apt.time}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.patientName}>{apt.patient}</Text>
                <View style={styles.typeTag}>
                  <Ionicons name="ellipse" size={8} color={apt.iconColor} />
                  <Text style={[styles.typeText, { color: apt.iconColor }]}>{apt.type}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.appointmentAction}>
                <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: "#EEF2FF" }]}>
              <Ionicons name="calendar" size={28} color={COLORS.primary} />
              <Text style={styles.actionLabel}>Yeni Randevu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: "#D1FAE5" }]}>
              <Ionicons name="time" size={28} color={COLORS.success} />
              <Text style={styles.actionLabel}>Boş Saatler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="download" size={28} color={COLORS.warning} />
              <Text style={styles.actionLabel}>Rapor Al</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: "#FCE7F3" }]}>
              <Ionicons name="settings" size={28} color={COLORS.danger} />
              <Text style={styles.actionLabel}>Ayarlar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dateCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  dateLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayName: {
    fontSize: 14,
    color: "#64748B",
  },
  dayNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: COLORS.primary,
  },
  dateRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  monthYear: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  dateNav: {
    flexDirection: "row",
    gap: 8,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  appointmentList: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  appointmentTime: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 14,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  typeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  appointmentAction: {
    padding: 8,
  },
  quickActions: {
    paddingBottom: 100,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    width: "47%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginTop: 8,
  },
});
