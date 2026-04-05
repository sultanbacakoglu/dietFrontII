import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { getHastalar } from "../services/api";

export default function Dashboard() {
  const [hastalar, setHastalar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
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
                <Ionicons name="notifications-outline" size={22} color="#1A1A1A" />
              </TouchableOpacity>
              <View style={styles.avatarCircle}>
                <Text style={{ fontSize: 18 }}>👩‍⚕️</Text>
              </View>
            </View>
          </View>

          {/* İstatistik Kartları (Dinamik) */}
          <View style={styles.statsGrid}>
            <StatCard
                title="Toplam Hasta"
                value={hastalar.length.toString()}
                percentage="+12%"
                type="patients"
            />
            <StatCard
                title="Bugünkü Randevu"
                value="2"
                type="today_appointment"
            />
          </View>

          {/* Liste Başlığı */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kayıtlı Hastalar</Text>
          </View>

          {/* Randevu Listesi (Dinamik) */}
          <View style={styles.listContainer}>
            {hastalar.map((hasta) => (
                <AppointmentCard
                    key={hasta.id}
                    name={hasta.adSoyad}
                    time={hasta.telefon || "Randevu Yok"}
                />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}

// Stilleri dosya içinde tanımlıyoruz (Hata buradaydı)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: Platform.OS === "web" ? 20 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
  listContainer: { width: "100%" },
});