import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppointmentCard } from "../../components/AppointmentCard";
import { StatCard } from "../../components/StatCard";

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Web'de scroll barın çirkin durmaması için showVerticalScrollIndicator={false} ekledik */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Üst Header Kısmı */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Ionicons name="medical" size={20} color="#007AFF" />
            </View>
            <Text style={styles.headerTitle}>Ana Sayfa</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#1A1A1A"
              />
            </TouchableOpacity>
            <View style={styles.avatarCircle}>
              <Text style={{ fontSize: 18 }}>👩‍⚕️</Text>
            </View>
          </View>
        </View>

        {/* İstatistik Kartları (Yan Yana) */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Toplam Hasta"
            value="128"
            percentage="+12%"
            type="patients"
          />
          <StatCard
            title="Bugünkü Randevu"
            value="8"
            type="today_appointment"
          />
        </View>

        {/* Yaklaşan Randevu (Tam Genişlik) */}
        <StatCard
          title="Yaklaşan Randevu"
          value="24"
          type="upcoming"
          style={{ width: "100%" }}
        />

        {/* Liste Başlığı */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Yaklaşan Randevular</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        {/* Randevu Listesi */}
        <View style={styles.listContainer}>
          <AppointmentCard name="Ahmet Yılmaz" time="Bugün, 14:30" />
          <AppointmentCard name="Ayşe Demir" time="Bugün, 16:00" />
          <AppointmentCard name="Mehmet Can" time="Yarın, 09:30" />
          <AppointmentCard name="Zeynep Kaya" time="Yarın, 11:15" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    // Web'de SafeAreaView bazen üstten boşluk vermez, manuel ekleyelim
    paddingTop: Platform.OS === "web" ? 20 : 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Alt menünün üstüne binmemesi için pay bıraktık
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#1A1A1A",
  },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE5D9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD7C2",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  seeAll: { color: "#007AFF", fontWeight: "600" },
  listContainer: { width: "100%" },
});
