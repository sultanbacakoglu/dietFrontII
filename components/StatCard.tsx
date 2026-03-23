import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

// 1. Geçerli tip tanımlamaları (TypeScript Hatalarını Önler)
type StatType = "patients" | "today_appointment" | "upcoming";

interface StatConfig {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
}

const typeConfigs: Record<StatType, StatConfig> = {
  patients: {
    icon: "people",
    iconColor: "#007AFF",
    bgColor: "#E3F2FD",
  },
  today_appointment: {
    icon: "calendar",
    iconColor: "#FF9500",
    bgColor: "#FFF3E0",
  },
  upcoming: {
    icon: "calendar-clear",
    iconColor: "#5856D6",
    bgColor: "#EDE7F6",
  },
};

interface StatCardProps {
  title: string;
  value: string;
  percentage?: string;
  type: StatType;
  style?: object; // Ekstra stil vermek gerekirse (Geniş kart için)
}

// 2. Bileşen Tanımı
export const StatCard = ({
  title,
  value,
  percentage,
  type,
  style,
}: StatCardProps) => {
  const config = typeConfigs[type];

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View
          style={[styles.iconContainer, { backgroundColor: config.bgColor }]}
        >
          <Ionicons name={config.icon} size={20} color={config.iconColor} />
        </View>
        {percentage && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{percentage}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

// 3. Stiller
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    width: (width - 50) / 2, // Yan yana iki kart için optimize edildi
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: "#4CAF50",
    fontSize: 10,
    fontWeight: "bold",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
});
