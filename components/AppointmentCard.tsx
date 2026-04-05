import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const AppointmentCard = ({ name, time }: any) => {
  const avatarText = name
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{avatarText}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color="#007AFF" />
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#AEAEB2" />
        </TouchableOpacity>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#D1D1D6"
          style={{ marginLeft: 10 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  leftSection: { flexDirection: "row", alignItems: "center" },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#8E8E93", fontWeight: "bold", fontSize: 18 },
  info: { marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "600", color: "#1A1A1A" },
  timeRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  time: { fontSize: 13, color: "#8E8E93", marginLeft: 4 },
  rightSection: { flexDirection: "row", alignItems: "center" },
  iconButton: { padding: 8 },
});
